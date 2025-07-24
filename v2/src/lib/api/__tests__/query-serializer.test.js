// テスト用スクリプト
const customQuerySerializer = (queryObject) => {
  const params = new URLSearchParams()

  const addParams = (obj) => {
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) continue

      if (Array.isArray(obj[key])) {
        obj[key].forEach((item) => {
          if (typeof item === 'object') {
            addParams(item)
          } else {
            params.append(key, String(item))
          }
        })
      } else if (typeof obj[key] === 'object') {
        addParams(obj[key])
      } else {
        params.append(key, String(obj[key]))
      }
    }
  }

  addParams(queryObject)
  return params.toString()
}

// テストケース
const testQuery = {
  form: {
    village_status: ['PROLOGUE', 'IN_PROGRESS', 'EPILOGUE'],
  },
}

console.log(
  '修正前（予想）: form%5Bvillage_status%5D%5B%5D=PROLOGUE&form%5Bvillage_status%5D%5B%5D=IN_PROGRESS&form%5Bvillage_status%5D%5B%5D=EPILOGUE'
)
console.log('修正後:', customQuerySerializer(testQuery))
console.log('デコード後:', decodeURIComponent(customQuerySerializer(testQuery)))
