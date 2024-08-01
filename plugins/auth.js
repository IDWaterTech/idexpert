// // plugins/auth.js
// export default function ({ $axios, $auth, redirect }) {
//     // 检查 $auth 是否已被正确注入
//     if (!$auth) {
//       console.error('$auth is not available:',$auth )
//       return
//     }
//     // else{
//     //     console.log("$auth is available.")
//     // }
  
//     // 添加请求拦截器
//     $axios.onRequest(config => {
//       console.log('Making request to ' + config.url)
//     })
  
//     // 添加响应拦截器
//     $axios.onResponse(response => {
//       console.log('Response received from ' + response.config.url)
//     })
  
//     // 添加错误拦截器
// }
// plugins/auth.js
export default function ({ $axios,$auth, redirect, app }) {
    if (!$auth) {
      console.error('$auth is not available')
      return
    }else{
        if($auth.error){
            sessionStorage.setItem('loginfailData', JSON.stringify($auth.error.response.data));
            redirect('loginfail');
        }
        // console.error( $axios,$auth, redirect, app)
    }
    
    // $axios.onRequest(config => {
    //     // 在请求发起时设置自定义请求头（如果需要）
    //     config.headers['x-request-ip'] = 'some-ip-address' // 这里你可能需要服务器提供实际的 IP 地址
    //     return config
    //   })

    // $axios.onResponse(response => {
    //     // 处理响应并获取状态码和 IP 地址
    //     const statusCode = response.status
    //     const requestIp = response.headers['x-request-ip'] || 'IP not available'
    
    //     console.log(`Response Status Code: ${statusCode}`)
    //     console.log(`Request IP: ${requestIp}`)
    
    //     return response
    //   })
      $axios.onError(error => {
        const statusCode = error.response ? error.response.status : null
        const requestIp = error.response ? error.response.headers['x-request-ip'] : 'IP not available'
    
        if (statusCode) {
          console.error(`Error Status Code: ${statusCode}`)
          console.error(`Request IP: ${requestIp}`)
        }
    
        // 可以在这里添加其他错误处理逻辑，例如重定向
        if (statusCode === 400) {
          app.$toast.error('请求失败，参数无效或请求格式错误。')
          redirect('/error') // 替换为你的错误处理路径
        }
      })
  }
  