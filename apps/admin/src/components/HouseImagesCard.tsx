"use client";

import React from "react";

export const HouseImagesCard = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div className="house-images-card">
    <style jsx>
      {`
        .house-images-card {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 958px;
          transform: scale(${window.innerHeight / 958});
          transform-origin: top center;
          overflow: hidden;
          background: transparent;
        }

        .property-card {
          width: 430px;
          background: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          transform-origin: top;
        }

        .header {
          background: linear-gradient(135deg, #98d8aa, #7fb069);
          padding: 40px 20px 35px;
          text-align: center;
          position: relative;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          pointer-events: none;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
          margin-left: 20px;
        }

        .logo-icon {
          width: 35px;
          height: 35px;
          background: #ffffff;
          border-radius: 8px;
          margin-right: 12px;
          position: relative;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .logo-icon::after {
          content: "🏠";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
        }

        .logo-text {
          color: #ffffff;
          font-size: 22px;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 1px;
        }

        .main-title {
          color: #2d5016;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 12px;
          text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
          position: relative;
          z-index: 2;
          letter-spacing: 2px;
        }

        .subtitle {
          color: #2d5016;
          font-size: 16px;
          font-weight: 500;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
          position: relative;
          z-index: 2;
        }

        .badge {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 65px;
          height: 65px;
          background: radial-gradient(circle, #ffffff, #f8f9fa);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #2d5016;
          font-weight: bold;
          text-align: center;
          border: 3px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          z-index: 3;
        }

        .badge::before {
          content: "";
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent,
            #98d8aa,
            transparent
          );
          z-index: -1;
        }

        .floor-plan {
          background: #fafafa;
          padding: 20px;
          margin: 0;
        }

        .floor-plan-title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #333;
        }

        .floor-plan-container {
          background: white;
          border-radius: 12px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .floor-plan-placeholder {
          width: 100%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .floor-plan-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
        }

        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .placeholder-text {
          font-size: 18px;
          font-weight: bold;
          color: #2d5016;
          margin-bottom: 20px;
        }

        .placeholder-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: 12px;
          color: #2d5016;
          text-align: left;
          max-width: 300px;
          margin: 0 auto;
        }

        .placeholder-details div {
          padding: 4px 8px;
          background: white;
          border-radius: 4px;
          border: 1px solid #98d8aa;
          font-weight: 500;
        }

        .property-details {
          padding: 20px;
          background: white;
          border-radius: 12px 12px 0 0;
          margin-top: -10px;
          position: relative;
          z-index: 1;
        }

        .location {
          color: #000000;
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 15px;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .price-item,
        .layout-item,
        .area-item {
          text-align: center;
          flex: 1;
        }

        .price-label,
        .layout-label,
        .area-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .price {
          color: #ff4444;
          font-size: 24px;
          font-weight: bold;
        }

        .layout {
          color: #ff4444;
          font-size: 22px;
          font-weight: bold;
        }

        .area {
          color: #ff4444;
          font-size: 22px;
          font-weight: bold;
        }

        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature-tag {
          background: #f0f0f0;
          color: #666;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        .bottom-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 0 20px 20px;
        }

        .agent-info {
          display: flex;
          align-items: center;
        }

        .agent-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ddd;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .agent-details {
          font-size: 12px;
        }

        .agent-name {
          font-weight: bold;
          color: #333;
        }

        .agent-phone {
          color: #666;
          margin-top: 2px;
        }

        .qr-code {
          text-align: center;
        }

        .qr-code-icon {
          width: 60px;
          height: 60px;
          background: #f0f0f0;
          border-radius: 8px;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .qr-code-text {
          font-size: 10px;
          color: #666;
          line-height: 1.3;
        }
      `}
    </style>
    <div ref={ref} className="property-card">
      <div className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <div className="logo-text">美大优选</div>
        </div>
        <h1 className="main-title">优选房源</h1>
        <p className="subtitle">品质房源, 等您来选~</p>
        <div className="badge">MEIDA</div>
      </div>

      <div className="floor-plan">
        <div className="floor-plan-container">
          <div className="floor-plan-placeholder">
            <img src="https://picsum.photos/800/600" alt="户型图" />
          </div>
        </div>
      </div>

      <div className="property-details">
        <h1 className="location">塘河 贾家弄新村</h1>
        <div className="price-section">
          <div className="price-item">
            <div className="price-label">售价</div>
            <div className="price">92万</div>
          </div>
          <div className="layout-item">
            <div className="layout-label">户型</div>
            <div className="layout">2室1厅1卫</div>
          </div>
          <div className="area-item">
            <div className="area-label">面积</div>
            <div className="area">40.09m²</div>
          </div>
        </div>
        <div className="features">
          <span className="feature-tag">满五年</span>
          <span className="feature-tag">近公园</span>
          <span className="feature-tag">近地铁</span>
          <span className="feature-tag">随时看</span>
        </div>
      </div>

      <div className="bottom-section">
        <div className="agent-info">
          <div className="agent-avatar">👨</div>
          <div className="agent-details">
            <div className="agent-name">应景波</div>
            <div className="agent-phone">4008893173,6523</div>
          </div>
        </div>
        <div className="qr-code">
          <div className="qr-code-icon">🏠</div>
          <div className="qr-code-text">
            长按识别小程序码
            <br />
            了解更多房源情况
          </div>
        </div>
      </div>
    </div>
  </div>
));
