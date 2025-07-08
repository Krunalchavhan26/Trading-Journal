import React from 'react'
import { FullOrderbook as OrderbookDetails } from '../../components/index'

const FullOrderbook = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        <OrderbookDetails/>
      </div>
    </div>
  )
}

export default FullOrderbook
