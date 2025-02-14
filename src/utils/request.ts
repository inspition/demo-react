import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API, // API 的基础 URL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如，可以在这里添加 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    return response.data;
  },
  error => {
    // 对响应错误做些什么
    console.error(error);
    return Promise.reject(error);
  }
);

export default service;