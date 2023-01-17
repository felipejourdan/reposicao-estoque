import React from 'react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

function App() {
  const [excelFile, setExcelFile] = React.useState(null)
  const [excelData, setExcelData] = React.useState(null)
  const [reabastecer, setReabastecer] = React.useState(null)
  const [reposicao, setReposicao] = React.useState()
  const [filialAtual, setFilialAtual] = React.useState('')

  const handleFile = e => {
    let selectedFile = e.target.files[0]

    if (selectedFile) {
      console.log(selectedFile)
      let reader = new FileReader()
      reader.readAsArrayBuffer(selectedFile)
      reader.onload = e => {
        setExcelFile(e.target.result)
      }
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    const workbook = XLSX.read(excelFile, { type: 'buffer' })
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    setExcelData(data)
    console.log(data)
  }

  React.useEffect(() => {
    if (excelData != null) {
      const reporEcommerce = excelData.filter(
        e => e.Filial === 'ECOMMERCE' && e.QtdEstoque < 0 && e.QtdVenda > 0
      )
      setReabastecer(reporEcommerce)
    }
  }, [excelData]) //verifica se há novos dados e filtra apenas os itens que precisam ser reabastecidos no e-commerce

  function gerarReposicao(filial) {
    console.log('reabastecer', reabastecer)
    console.log('filial', filial)
    const filtroReabastecer = []

    reabastecer.map(a => {
      const repoFiltrada = excelData.filter(e =>
        a.CódProduto === e.CódProduto && e.QtdEstoque > 0 && e.Filial === filial
          ? filtroReabastecer.push({
              Sku: a.CódProduto,
              QtdRepor: a.QtdVenda
            })
          : null
      )

      console.log('filtroReabastecer', filtroReabastecer)
      return repoFiltrada
    }, setReposicao(filtroReabastecer))
    console.log('filtro reabastecer', filtroReabastecer)
    setFilialAtual(filial)
  }

  function baixarReposicaoGerada() {
    const worksheet = XLSX.utils.json_to_sheet(reposicao)
    const workbook = {
      Sheets: {
        data: worksheet
      },
      SheetNames: ['data']
    }
    const excelBuffer = XLSX.write(workbook, {
      booktype: 'xlsx',
      type: 'array'
    })
    saveAsExcel(excelBuffer, 'reposicao')
  }

  function saveAsExcel(buffer, fileName) {
    const data = new Blob([buffer])
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.csv')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFile}></input>
        <button type="submit">Enviar</button>
      </form>

      <div>
        <button onClick={() => gerarReposicao('RIO SUL')}>
          Gerar reposição HDA para E-Commerce
        </button>
      </div>
      <div>
        <button onClick={() => gerarReposicao('LEBLON')}>
          Gerar reposição LEELA para E-Commerce
        </button>
      </div>
      {filialAtual ? (
        <div>
          <h1>Reposição gerada de {filialAtual} para E-Commerce</h1>
          <button onClick={baixarReposicaoGerada}>
            Baixar reposição {filialAtual} para E-commerce
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
