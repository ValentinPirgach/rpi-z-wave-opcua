import axios from 'axios'

// Configure http requsts
axios.defaults.baseURL = process.env.Z_WAVE_API_URL

// Add a request interceptor
/* eslint no-param-reassign: 0 */
axios.interceptors.request.use(config => {
  // console.log(`Request sent to: ${config.baseURL}${config.url}`.blue)
  // console.log('\n')
  return config
})

// /* eslint no-param-reassign: 0 */
// axios.interceptors.request.use(config => {
//   config.withCredentials = true
//   return config;
// });
