
'use server';

// This file simulates a backend service or database connection.
// In a real application, these functions would fetch data from a live data source.

export interface MonthlySales {
  month: string;
  desktop: number;
  mobile: number;
}

export interface SalesTrend {
    date: string;
    sales: number;
}

export interface ProductSale {
    name: string;
    revenue: number;
}

const monthlySalesData: MonthlySales[] = [
  { month: "Jan", desktop: 18600, mobile: 8000 },
  { month: "Feb", desktop: 30500, mobile: 20000 },
  { month: "Mar", desktop: 23700, mobile: 12000 },
  { month: "Apr", desktop: 7300, mobile: 19000 },
  { month: "May", desktop: 20900, mobile: 13000 },
  { month: "Jun", desktop: 21400, mobile: 14000 },
];

const salesTrendData: SalesTrend[] = [
  { date: '2024-01-01', sales: 26600 },
  { date: '2024-02-01', sales: 50500 },
  { date: '2024-03-01', sales: 35700 },
  { date: '2024-04-01', sales: 26300 },
  { date: '2024-05-01', sales: 33900 },
  { date: '2024-06-01', sales: 35400 },
  { date: '2024-07-01', sales: 41000 },
];

const topProductsData: ProductSale[] = [
    { name: "Quantum Entangler", revenue: 55000 },
    { name: "Positronic Brain Gel", revenue: 42000 },
    { name: "Chroniton Emitter", revenue: 31000 },
    { name: "Flux Capacitor", revenue: 25000 },
    { name: "Tachyon Field Modulator", revenue: 15000 },
];


export async function getMonthlySales(): Promise<MonthlySales[]> {
    // In a real app, this would be a DB query.
    return monthlySalesData;
}

export async function getSalesTrend(): Promise<SalesTrend[]> {
    return salesTrendData;
}

export async function getTopProducts(limit: number = 3): Promise<ProductSale[]> {
    return topProductsData.slice(0, limit);
}

export async function getTotalRevenue(): Promise<number> {
    return salesTrendData.reduce((acc, curr) => acc + curr.sales, 0);
}
