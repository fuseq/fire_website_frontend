import { useState, useEffect } from "react";
import { productsAPI } from "../api";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  specs: string[];
  inStock: boolean;
  reviews?: Array<{
    id: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export function useProducts(filters?: {
  category?: string;
  search?: string;
  inStock?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll(filters);
        
        if (response.success) {
          setProducts(
            response.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: parseFloat(p.price),
              image: p.image || "/placeholder.svg",
              images: p.images || [],
              description: p.description || "",
              specs: p.specs || [],
              inStock: p.in_stock,
              reviews: [],
            }))
          );
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.category, filters?.search, filters?.inStock]);

  return { products, loading, error };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        
        if (response.success) {
          setProduct({
            id: response.data.id,
            name: response.data.name,
            category: response.data.category,
            price: parseFloat(response.data.price),
            image: response.data.image || "/placeholder.svg",
            images: response.data.images || [],
            description: response.data.description || "",
            specs: response.data.specs || [],
            inStock: response.data.in_stock,
            reviews: response.data.reviews || [],
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsAPI.getCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error("Kategoriler yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}
