import React from 'react'
import {AddOrderbookBtn, AllOrderbooks as Orderbooks} from "../../components/index"

const AllOrderbooks = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        <AddOrderbookBtn/>
        <Orderbooks/>
      </div>
    </div>
  )
}

export default AllOrderbooks