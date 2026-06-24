import type { Product } from "../models/responses/Product";
import { config } from "../config";



const API_URL = `${config.api.url}/products`;

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch(API_URL);


        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;

    }
}