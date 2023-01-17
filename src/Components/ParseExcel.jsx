import React from 'react'
import readXlsxFile from 'read-excel-file'

export const ParseExcel = () => {
  const selectedFile = document.getElementById('input')

  console.log(selectedFile)

  return (
    <div>
      <h1>Parse Excel</h1>
      <input type="file" accept=".xls, .xlsx" id="input" />
    </div>
  )
}
