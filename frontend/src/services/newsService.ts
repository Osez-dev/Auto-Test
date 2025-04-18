const API_URL = `${import.meta.env.VITE_BASE_URL}/news`;

export interface News {
  id: number;
  title: string;
  author: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export interface CreateNewsDto {
  id?: number;
  title: string;
  author: string;
  content: string;
  imageUrl: string;
}

export interface UpdateNewsDto {
  title?: string;
  author?: string;
  content?: string;
  imageUrl?: string;
}

export const getNews = async (): Promise<News[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Error fetching news: ${response.status}`);
  }
  return response.json();
};

export const getNewsById = async (id: number): Promise<News> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Error fetching news with ID ${id}: ${response.status}`);
  }
  return response.json();
};

export const createNews = async (news: CreateNewsDto): Promise<News> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(news),
  });

  if (!response.ok) {
    throw new Error(`Error creating news: ${response.status}`);
  }
  return response.json();
};

export const updateNews = async (
  id: number,
  news: UpdateNewsDto
): Promise<News> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(news),
  });

  if (!response.ok) {
    throw new Error(`Error updating news with ID ${id}: ${response.status}`);
  }
  return response.json();
};

export const deleteNews = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error deleting news with ID ${id}: ${response.status}`);
  }
};
