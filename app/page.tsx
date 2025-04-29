"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { salesData } from "@/lib/data"

export default function SalesDashboard() {
  const [categories, setCategories] = useState<string[]>([])
  const [products, setProducts] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedBrand, setSelectedBrand] = useState<string>("")

  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const uniqueCategories = [...new Set(salesData.map((item) => item.category))]
    setCategories(uniqueCategories)

    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0])
    }
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      const filteredProducts = [
        ...new Set(salesData.filter((item) => item.category === selectedCategory).map((item) => item.product)),
      ]

      setProducts(filteredProducts)
      setSelectedProduct(filteredProducts.length > 0 ? filteredProducts[0] : "")
      setSelectedBrand("")
    } else {
      setProducts([])
      setSelectedProduct("")
      setBrands([])
      setSelectedBrand("")
    }
  }, [selectedCategory])

  useEffect(() => {
    if (selectedProduct) {
      const filteredBrands = [
        ...new Set(
          salesData
            .filter((item) => item.category === selectedCategory && item.product === selectedProduct)
            .map((item) => item.brand),
        ),
      ]

      setBrands(filteredBrands)
      setSelectedBrand(filteredBrands.length > 0 ? filteredBrands[0] : "")
    } else {
      setBrands([])
      setSelectedBrand("")
    }
  }, [selectedProduct, selectedCategory])

  useEffect(() => {
    if (selectedBrand) {
      const brandData = salesData.find(
        (item) =>
          item.category === selectedCategory && item.product === selectedProduct && item.brand === selectedBrand,
      )

      if (brandData) {
        const formattedData = [
          { month: "Janeiro", vendas: brandData.sales.jan },
          { month: "Fevereiro", vendas: brandData.sales.feb },
          { month: "Março", vendas: brandData.sales.mar },
          { month: "Abril", vendas: brandData.sales.apr },
        ]
        setChartData(formattedData)
      } else {
        setChartData([])
      }
    } else {
      setChartData([])
    }
  }, [selectedBrand, selectedProduct, selectedCategory])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Vendas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="product">Produto</Label>
          <Select
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
            disabled={!selectedCategory}
          >
            <SelectTrigger id="product">
              <SelectValue placeholder="Selecione um produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="brand">Marca</Label>
          <Select value={selectedBrand} onValueChange={(value) => setSelectedBrand(value)} disabled={!selectedProduct}>
            <SelectTrigger id="brand">
              <SelectValue placeholder="Selecione uma marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {selectedBrand
              ? `Vendas da marca ${selectedBrand} (${selectedProduct} - ${selectedCategory})`
              : "Selecione uma marca para visualizar os dados de vendas"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="#8884d8" name="Vendas (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              Nenhum dado disponível
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
