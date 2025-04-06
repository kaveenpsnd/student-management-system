import { Package, Tag, Hash, Calculator } from "lucide-react"

function ItemDetail({ item }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{item.category}</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-semibold">{item.quantity}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Tag className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-semibold">Rs.{item.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Calculator className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="font-semibold">Rs.{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Hash className="w-5 h-5 text-gray-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Item ID</p>
              <p className="font-semibold text-xs">{item._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail

