import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
export const settingsSlider = {
  modules: [Navigation, Pagination, Autoplay], // Các module cần thiết
  slidesPerView: 1, // Hiển thị 1 slide cùng lúc
  navigation: true, // Kích hoạt navigation
  pagination: { clickable: true }, // Pagination với các chấm có thể click
  // autoplay: { delay: 3000 }, // Tự động chuyển slide sau 3 giây
};
export const card = {
  modules: [Navigation, Pagination, Autoplay], // Các module cần thiết
  slidesPerView: 4, // Hiển thị 1 slide cùng lúc
  navigation: true, // Kích hoạt navigation
  pagination: { clickable: true }, // Pagination với các chấm có thể click
  autoplay: { delay: 3000 }, // Tự động chuyển slide sau 3 giây
  spaceBetween: 20,
};