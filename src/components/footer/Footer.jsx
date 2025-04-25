import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-lists">
          <ul className="footer-list">
            <h2 className="footer-title">Khách sạn của chúng tôi</h2>
            <li className="footer-list-item">Khách sạn</li>
            <li className="footer-list-item">Căn hộ</li>
            <li className="footer-list-item">Resort</li>
            <li className="footer-list-item">Homestay</li>
            <li className="footer-list-item">Villa</li>
          </ul>
          <ul className="footer-list">
            <h2 className="footer-title">Khu vực</h2>
            <li className="footer-list-item">Hà Nội</li>
            <li className="footer-list-item">Hồ Chí Minh</li>
            <li className="footer-list-item">Đà Nẵng</li>
            <li className="footer-list-item">Phú Quốc</li>
            <li className="footer-list-item">Đà Lạt</li>
          </ul>
          <ul className="footer-list">
            <h2 className="footer-title">Hỗ trợ</h2>
            <li className="footer-list-item">Trung tâm trợ giúp</li>
            <li className="footer-list-item">FAQ</li>
            <li className="footer-list-item">Chính sách hoàn tiền</li>
            <li className="footer-list-item">Báo cáo sự cố</li>
            <li className="footer-list-item">Chương trình đối tác</li>
          </ul>
          <ul className="footer-list">
            <h2 className="footer-title">Thông tin</h2>
            <li className="footer-list-item">Về chúng tôi</li>
            <li className="footer-list-item">Tin tức & Blog</li>
            <li className="footer-list-item">Chính sách bảo mật</li>
            <li className="footer-list-item">Điều khoản sử dụng</li>
            <li className="footer-list-item">Liên hệ</li>
          </ul>
        </div>
        <div className="footer-copyright">
          <p>© Copyright by ZotelBooking 2025. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;