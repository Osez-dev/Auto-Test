"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getListingById } from "../../services/listingService"
import { getSpareParts } from "../../services/sparePartsService"
import { addToFavorites, removeFromFavorites, isInFavorites } from "../../services/favoritesService"
import SparePartCard from "../SparePartCard/SparePartCard"
import Navbar from "../Navbar"
import Container from "../Container/Container"
import LoanCalculator from "../LoanCalculator/LoanCalculator"
import { Heart, HeartOff, Phone, MessageCircle, Copy, MapPin, Mail } from "lucide-react"
import Footer from "../../components/Footer"
import TradeInModal from "./Trade-In-Modal"
import { OfferPriceModal } from "../../components/ListingCard/Make-An-Offer-Modal"

interface Listing {
  id: number
  imageUrls: string[]
  title: string
  yearofmanufacture: number
  mileage: string
  fuelType: string
  transmission: string
  blueTGrade: string
  price: number
  createdAt: string
  sellersNotes?: string
  condition?: string
  regno?: string
  make?: string
  model?: string
  bodyType?: string
  district?: string
  city?: string
  engineCc?: number
  grade?: string
  exteriorColor?: string
  interiorColor?: string
  noOfOwners?: number
  yearOfReg?: number
  userId: number
  viewCount?: number
  user?: {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
  }
  [key: string]: any // Additional fields
}

interface SparePart {
  id: number
  name: string
  keywords: string[]
  imageUrls: string[]
  stock: number
}

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<Listing | null>(null)
  const [spareParts, setSpareParts] = useState<SparePart[]>([])
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null)
  const [activeImage, setActiveImage] = useState<number>(0)
  const [thumbnails, setThumbnails] = useState<string[]>([])
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const navigate = useNavigate()
  const [showFullNumber, setShowFullNumber] = useState(false)
  const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false)
  const [isOfferPriceModalOpen, setIsOfferPriceModalOpen] = useState(false)

  // Show notification helper
  const showNotification = (message: string, type: string) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListingById(Number(id))
        setListing(data)

        // Set thumbnails
        if (data.imageUrls && data.imageUrls.length > 0) {
          setThumbnails(data.imageUrls)
        }

        // Check if listing is in favorites
        const userProfile = sessionStorage.getItem('userProfile');
        if (userProfile) {
          const { id: userId } = JSON.parse(userProfile)
          setIsFavorite(isInFavorites(userId, Number(id)))
        }
      } catch (error) {
        console.error("Error fetching listing details:", error)
      }
    }

    fetchListing()
  }, [id])

  useEffect(() => {
    const fetchSpareParts = async () => {
      if (id) {
        try {
          const data = await getSpareParts(Number(id))
          setSpareParts(data)
        } catch (error) {
          console.error("Error fetching spare parts:", error)
        }
      }
    }

    fetchSpareParts()
  }, [id])

  const handleFavoriteClick = () => {
    const userProfile = sessionStorage.getItem('userProfile');
    if (!userProfile) {
      navigate("/login")
      return
    }

    const { id: userId } = JSON.parse(userProfile)
    if (isFavorite) {
      removeFromFavorites(userId, Number(id))
      setIsFavorite(false)
      showNotification("Removed from favorites", "success")
    } else {
      addToFavorites(userId, Number(id))
      setIsFavorite(true)
      showNotification("Added to favorites", "success")
    }
  }

  if (!listing) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  const phoneNumber = listing.user?.phoneNumber
  const maskedNumber = phoneNumber ? phoneNumber.slice(0, -3).replace(/./g, "•") + phoneNumber.slice(-3) : null

  const copyToClipboard = () => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber)
      showNotification("Phone number copied!", "success")
    }
  }

  // Get the first image URL or use a placeholder
  const mainImageUrl = thumbnails[activeImage] 
    ? thumbnails[activeImage].startsWith('http') 
      ? thumbnails[activeImage] 
      : `${import.meta.env.VITE_BASE_URL}${thumbnails[activeImage]}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <>
      <Navbar />
      <Container>
        {notification && (
          <div
            className={`fixed top-5 right-5 p-3 rounded-md shadow-md z-50 text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } animate-fade-in-out`}
          >
            {notification.message}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {listing.title} - {listing.yearofmanufacture}
              </h1>
              <div className="flex items-center gap-[33rem]">
                <p className="text-sm text-gray-500">Posted on: {new Date(listing.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Views: {listing.views || 0}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <span className="text-2xl font-bold text-blue-600">Rs. {listing.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-[400px] md:h-[450px]">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <img
                    src={imageError ? "https://via.placeholder.com/300x200?text=Image+Not+Available" : mainImageUrl}
                    alt={listing.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-blue-500/40 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    className={`absolute top-4 right-4 p-2 rounded-full shadow-md transition-all hover:scale-105 ${
                      isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"
                    }`}
                    onClick={handleFavoriteClick}
                  >
                    {isFavorite ? <HeartOff size={24} /> : <Heart size={24} />}
                  </button>
                </div>

                {/* Thumbnails */}
                {thumbnails.length > 0 && (
                  <div className="bg-gray-100 p-3">
                    <div className="grid grid-cols-3 gap-2">
                      {thumbnails.slice(0, 6).map((url, index) => (
                        <div
                          key={index}
                          className={`aspect-square rounded overflow-hidden cursor-pointer transition-all ${
                            activeImage === index ? "ring-2 ring-blue-500" : "ring-1 ring-gray-200"
                          }`}
                          onClick={() => {
                            setActiveImage(index);
                            setImageLoading(true);
                            setImageError(false);
                          }}
                        >
                          <img
                            src={url.startsWith('http') ? url : `${import.meta.env.VITE_BASE_URL}${url}`}
                            alt={`${listing.title} - view ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Car Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">Car Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Year:</p>
                      <p className="font-medium text-gray-800">{listing.yearofmanufacture}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage:</p>
                      <p className="font-medium text-gray-800">{listing.mileage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type:</p>
                      <p className="font-medium text-gray-800">{listing.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transmission:</p>
                      <p className="font-medium text-gray-800">{listing.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blue T Grade:</p>
                      <p className="font-medium text-gray-800">{listing.blueTGrade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condition:</p>
                      <p className="font-medium text-gray-800">{listing.condition || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Number:</p>
                      <p className="font-medium text-gray-800">{listing.regno || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Make:</p>
                      <p className="font-medium text-gray-800">{listing.make || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model:</p>
                      <p className="font-medium text-gray-800">{listing.model || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Body Type:</p>
                      <p className="font-medium text-gray-800">{listing.bodyType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">District:</p>
                      <p className="font-medium text-gray-800">{listing.district || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City:</p>
                      <p className="font-medium text-gray-800">{listing.city || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Engine CC:</p>
                      <p className="font-medium text-gray-800">{listing.engineCc || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grade:</p>
                      <p className="font-medium text-gray-800">{listing.grade || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Exterior Color:</p>
                      <p className="font-medium text-gray-800">{listing.exteriorColor || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interior Color:</p>
                      <p className="font-medium text-gray-800">{listing.interiorColor || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Number of Owners:</p>
                      <p className="font-medium text-gray-800">{listing.noOfOwners || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year of Registration:</p>
                      <p className="font-medium text-gray-800">{listing.yearOfReg || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {listing.sellersNotes && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Seller's Notes</h3>
                    <p className="text-gray-700 leading-relaxed">{listing.sellersNotes}</p>
                  </div>
                )}
              </div>

              {/* Spare Parts */}
              {spareParts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">
                    Compatible Spare Parts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {spareParts.map((sparePart) => (
                      <SparePartCard
                        key={sparePart.id}
                        id={sparePart.id}
                        name={sparePart.name}
                        keywords={sparePart.keywords}
                        imageUrls={sparePart.imageUrls}
                        stock={sparePart.stock}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 ">
              {/* Dealer Card */}
              <div className="bg-white rounded-lg shadow-md p-6 leading-[5 rem]]">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden mr-3">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {listing.user?.firstName || "Seller"} {listing.user?.lastName}
                    </h3>
                  </div>
                </div>
                <h3 className="text-lg flex items-center gap-4">
                  <MapPin className="inline-block w-5 h-5" /> {/* Smaller icon */}
                  <span>
                    {listing.city || "City"} {listing.district}
                  </span>
                </h3>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-4 text-lg mt-3">
                    <Phone className="w-5 h-5" />
                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        {showFullNumber ? (
                          <span className="flex items-center gap-1">
                            {phoneNumber}
                            <Copy
                              className="w-4 h-4 ml-1 cursor-pointer text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard()
                              }}
                            />
                          </span>
                        ) : (
                          <span>{maskedNumber}</span>
                        )}
                      </span>
                      {!showFullNumber && (
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm underline ml-1"
                          onClick={() => setShowFullNumber(true)}
                        >
                          Show Number
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
                      onClick={() => window.open(`https://wa.me/${phoneNumber}`, "_blank")}
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </button>
                    <button
                      className="flex-1 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center justify-center gap-2"
                      onClick={() => window.open(`mailto:${listing.user?.email}`, "_blank")}
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setIsTradeInModalOpen(true)}
                >
                  Trade-In Form
                </button>
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setIsOfferPriceModalOpen(true)}>
                  Make An Offer
                </button>
                {/* <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                  Test Drive
                </button> */}
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
                  Add to Compare
                </button>
              </div>

              {/* Loan Calculator */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-gray-800">
                  Loan Calculator
                </h3>
                <LoanCalculator vehiclePrice={listing.price} />
              </div>
            </div>
          </div>
        </div>
      </Container>
      <TradeInModal
        open={isTradeInModalOpen}
        onOpenChange={setIsTradeInModalOpen}
        defaultVehicle={{
          make: listing.make || "",
          model: listing.model || "",
          year: listing.yearofmanufacture ? listing.yearofmanufacture.toString() : "",
        }}
      />
      <OfferPriceModal isOpen={isOfferPriceModalOpen} onClose={() => setIsOfferPriceModalOpen(false)} />
      <Footer />
    </>
  )
}

export default ListingDetails

