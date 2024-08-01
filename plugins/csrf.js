import Cookies from 'js-cookie';

export default function ({ $axios }) {
  // 监听请求前的事件，添加 CSRF 令牌
  $axios.onRequest(config => {
    const csrfToken = Cookies.get('csrftoken'); // 从 cookie 中获取 CSRF 令牌
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  });
}