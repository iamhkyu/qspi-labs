"use client";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Noto Sans KR', sans-serif;
          background-color: #fff;
          color: #000;
          overflow-x: hidden;
          min-height: 105vh;
        }

        .page-hero {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 32px;
          box-sizing: border-box;
          min-height: 60vh;
          background-color: #fff;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 30px;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-logo {
          height: 40px;
          width: auto;
        }

        .language-toggle {
          font-size: 1rem;
          color: black;
          display: flex;
          gap: 5px;
        }

        .language-link {
          text-decoration: none;
          font-weight: bold;
        }

        html[lang="ko"] #lang-ko {
          color: black;
        }
        html[lang="ko"] #lang-en {
          color: gray;
        }

        html[lang="en"] #lang-en {
          color: black;
        }
        html[lang="en"] #lang-ko {
          color: gray;
        }

        .hero-text-container {
          margin-top: 50px;
          padding-right: 24px;
          margin-bottom: 160px;
        }

        .hero-line {
          font-weight: 800;
          line-height: 1.15;
          word-break: keep-all;
          margin: 0;
          text-align: left;
          font-size: 12vw;
        }

        .gradient-text {
          display: inline-block;
          background: linear-gradient(90deg, hotpink 0%, #6C41FF 100%);
          background-size: 100%;
          background-repeat: no-repeat;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate {
          opacity: 0;
          animation: fadeSlideUp 1s ease-out forwards;
        }

        .delay-1 {
          animation-delay: 0.3s;
        }

        .delay-2 {
          animation-delay: 0.6s;
        }

        .page-screenshot-features {
          background-color: #f0f3f6;
          padding: 50px 24px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 100px;
          overflow: hidden;
        }

        .screenshot-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 90%;
          width: 100%;
          gap: 30px;
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .screenshot-section:first-child {
          opacity: 1;
          transform: translateY(0);
        }

        .screenshot-section.scroll-animate.active {
          opacity: 1;
          transform: translateY(0);
        }

        .screenshot-description {
          font-size: 2rem;
          font-weight: 600;
          line-height: 1.3;
          word-break: keep-all;
          margin: 0;
          text-align: left;
          width: 100%;
        }

        .description-black {
          color: black;
        }

        .description-dark-gray {
          color: #555;
        }

        .screenshot-image-container {
          width: 100%;
          max-width: 300px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          margin: 0 auto;
        }

        .screenshot-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .page-features {
          background-color: #ffffff;
          padding: 50px 24px;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          width: 100%;
          max-width: 1200px;
        }

        .feature-box {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          min-height: 160px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .feature-box.active {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-icon-top {
          font-size: 3rem;
          margin-bottom: 15px;
          text-align: left;
        }

        .feature-description-bottom {
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
          margin-top: auto;
          margin-bottom: 0;
          line-height: 1.4;
        }

        .page-reviews {
          background-color: #f0f3f6;
          padding: 50px 0;
          padding-bottom: 100px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }

        .reviews-title {
          display: none;
        }

        .review-cards-container {
          width: 100%;
          overflow-x: scroll;
          -webkit-overflow-scrolling: touch;
          display: flex;
          padding: 0 24px;
          box-sizing: border-box;
          gap: 20px;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
          cursor: grab;
        }

        .review-cards-container::-webkit-scrollbar {
          display: none;
        }

        .review-cards-container.active {
          cursor: grabbing;
        }

        .review-card {
          flex: 0 0 auto;
          width: 85%;
          max-width: 300px;
          background-color: #ffffff;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          scroll-snap-align: start;
        }

        .review-text {
          font-size: 1.0rem;
          line-height: 1.6;
          color: #333;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .review-author {
          font-size: 0.9rem;
          color: #777;
          text-align: right;
          font-weight: 500;
        }

        .page-footer {
          background-color: #f0f0f0;
          color: #555555;
          padding: 40px 24px;
          padding-bottom: 140px;
          box-sizing: border-box;
          text-align: left;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .footer-links a {
          color: #555555;
          text-decoration: none;
          font-weight: bold;
        }

        .footer-links span {
          color: #555555;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        .footer-info p {
          margin: 5px 0;
        }

        .app-download-btn-floating {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80%;
          max-width: 320px;
          height: 70px;
          border-radius: 40px;
          background: linear-gradient(90deg, #6C41FF 0%, hotpink 100%);
          box-shadow: 0 8px 20px rgba(108, 65, 255, 0.4);
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bold;
          font-size: 24px;
          user-select: none;
          z-index: 9999;
        }

        @media (min-width: 768px) {
          .page-hero {
            padding: 50px;
            min-height: 65vh;
          }
          .top-bar {
            margin-bottom: 40px;
          }
          .header-logo {
            height: 45px;
          }
          .hero-text-container {
            padding-right: 120px;
            margin-top: 30px;
            margin-bottom: 10px;
          }
          .hero-line {
            font-size: 6vw;
          }

          .features-grid {
            grid-template-columns: 1fr 1fr;
            gap: 25px;
          }

          .page-screenshot-features {
            padding: 70px 40px;
            gap: 120px;
          }
          .screenshot-section {
            gap: 40px;
            max-width: 90%;
            align-items: center;
          }
          .screenshot-image-container {
            max-width: 450px;
            margin: 0 auto;
          }
          .screenshot-description {
            font-size: 2.5rem;
          }

          .page-reviews {
            padding: 70px 0;
            padding-bottom: 120px;
          }
          .review-cards-container {
            padding: 0 40px;
            gap: 30px;
          }
          .review-card {
            width: 45%;
            max-width: 350px;
          }
          .page-footer {
            padding: 50px 40px;
            padding-bottom: 140px;
            font-size: 1rem;
            text-align: left;
          }

          .app-download-btn-floating {
            width: 70%;
            max-width: 350px;
            height: 75px;
            font-size: 26px;
            bottom: 30px;
          }
        }

        @media (min-width: 1024px) {
          .page-hero {
            padding: 70px;
            min-height: 70vh;
          }
          .top-bar {
            margin-bottom: 50px;
          }
          .header-logo {
            height: 50px;
          }
          .hero-text-container {
            padding-right: 60px;
            margin-top: 100px;
            margin-bottom: 10px;
          }
          .hero-line {
            font-size: 4.5vw;
          }

          .features-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
          }

          .page-screenshot-features {
            padding: 100px 60px;
            gap: 150px;
          }
          .screenshot-section {
            flex-direction: row;
            justify-content: center;
            align-items: center;
            text-align: left;
            gap: 60px;
            max-width: 90%;
          }
          .screenshot-section:nth-child(even) {
            flex-direction: row-reverse;
          }
          .screenshot-description {
            flex: 1;
            max-width: 40%;
            margin-bottom: 0;
            font-size: 3rem;
            text-align: left;
            width: auto;
          }
          .screenshot-image-container {
            flex: 1;
            max-width: 550px;
            margin: 0;
          }

          .page-reviews {
            padding: 100px 0;
            padding-bottom: 150px;
          }
          .review-cards-container {
            padding: 0 60px;
            gap: 40px;
          }
          .review-card {
            width: 30%;
            max-width: 380px;
            min-height: 180px;
          }
          .page-footer {
            padding: 60px 60px;
            padding-bottom: 140px;
            font-size: 1rem;
            text-align: left;
          }

          .app-download-btn-floating {
            width: 60%;
            max-width: 400px;
            height: 80px;
            font-size: 28px;
            bottom: 40px;
          }
        }
      `}</style>

      <div className="page-hero">
        <div className="top-bar">
          <div className="header-left">
            <img src="/images/logo.png" alt="큐스피 코인 로고: 혁신적인 코인 탐색기 QSPI" className="header-logo" />
          </div>
          <div className="language-toggle">
            <a href="/" id="lang-ko" className="language-link">ko</a>
            <span>|</span>
            <a href="/en/index.html" id="lang-en" className="language-link">en</a>
          </div>
        </div>

        <div className="hero-text-container">
          <p className="hero-line gradient-text animate delay-1">큐스피 코인</p>
          <p className="hero-line animate delay-2">차원이 다른 역대급 탐색기</p>
        </div>
      </div>

      <div className="page-screenshot-features">
        <div className="screenshot-section scroll-animate">
          <p className="screenshot-description">
            <span className="description-black">초보자도 쉽게</span><br />
            <span className="description-dark-gray">핵심만 콕!</span>
          </p>
          <div className="screenshot-image-container">
            <img src="/images/image1.jpg" alt="큐스피 코인 앱 초보자도 쉽게 코인 핵심 정보 파악 스크린샷" className="screenshot-image" />
          </div>
        </div>
        <div className="screenshot-section scroll-animate">
          <p className="screenshot-description">
            <span className="description-black">조건은 내 마음대로</span><br />
            <span className="description-dark-gray">흐름은 한눈에 파악</span>
          </p>
          <div className="screenshot-image-container">
            <img src="/images/image2.jpg" alt="큐스피 코인 앱 코인 검색 조건 설정 및 시장 흐름 한눈에 보기 스크린샷" className="screenshot-image" />
          </div>
        </div>
        <div className="screenshot-section scroll-animate">
          <p className="screenshot-description">
            <span className="description-black">AI 기반 분석으로</span><br />
            <span className="description-dark-gray">급등 가능성 포착</span>
          </p>
          <div className="screenshot-image-container">
            <img src="/images/image3.jpg" alt="큐스피 코인 앱 AI 코인 분석을 통한 급등 코인 예측 스크린샷" className="screenshot-image" />
          </div>
        </div>
        <div className="screenshot-section scroll-animate">
          <p className="screenshot-description">
            <span className="description-black">정확한 종목 분석으로</span><br />
            <span className="description-dark-gray">미래 차트 예측까지</span>
          </p>
          <div className="screenshot-image-container">
            <img src="/images/image4.jpg" alt="큐스피 코인 앱 코인 종목 분석 및 미래 차트 예측 스크린샷" className="screenshot-image" />
          </div>
        </div>
        <div className="screenshot-section scroll-animate">
          <p className="screenshot-description">
            <span className="description-black">내 전략에 맞게</span><br />
            <span className="description-dark-gray">실시간 상승 알림 받기</span>
          </p>
          <div className="screenshot-image-container">
            <img src="/images/image5.jpg" alt="큐스피 코인 앱 개인 맞춤형 코인 상승 알림 설정 스크린샷" className="screenshot-image" />
          </div>
        </div>
      </div>

      <div className="page-features" id="featuresPage">
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-top">🔍</div>
            <p className="feature-description-bottom">원하는 코인을 빠르게 발견할 수 있어요.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-top">👶</div>
            <p className="feature-description-bottom">누구나 쉽게 시장을 분석할 수 있어요.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-top">💡</div>
            <p className="feature-description-bottom">AI가 상승가능성과 차트를 예측해줘요.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-top">📈</div>
            <p className="feature-description-bottom">흐름을 그래픽으로 한눈에 보여줘요.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-top">📢</div>
            <p className="feature-description-bottom">매일매일 최신 트렌드를 요약해서 알려줘요.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon-top">🔔</div>
            <p className="feature-description-bottom">조건에 맞는 코인을 실시간으로 알려줘요.</p>
          </div>
        </div>
      </div>

      <div className="page-reviews">
        <div className="review-cards-container" id="reviewCardsContainer">
          <div className="review-card">
            <p className="review-text">"아주 알찬 정보가 많고 인터페이스가 좋아요. 최신 브리핑, 메가트렌드 참고로 시장의 흐름을 빠르게 파악할 수 있습니다. 앞으로도 빠른 뉴스와 정보 제공을 통해 코인 투자 필수 앱으로 자리매김하길 바랍니다!"</p>
            <p className="review-author">실제 사용자 리뷰</p>
          </div>
          <div className="review-card">
            <p className="review-text">"분야별 상승 하락이 제대로 표시되어 있는 것은 놀라운 기능입니다. 상승한 종목에 대한 알림이 분별, 퍼센트 별로 오는 것도 좋아요! 전반적으로 사용 목적이 명확하고 깔끔하네요. 이런 걸 두고 순기능이 좋다고 하나 보네요. 디테일하고 퀄리티 있어서 항상 앱 만족스럽게 사용하고 있습니다!"</p>
            <p className="review-author">실제 사용자 리뷰</p>
          </div>
          <div className="review-card">
            <p className="review-text">"저한테 꼭 필요했던 어플이고요. 분 단위로 되는 거 대박이네요! 5분 안에 급등한 코인 찾기가 어려웠는데 이렇게 보여주니까 정말 편리합니다. 어플 인터페이스도 눈에 확 들어오는 게 어렵지 않게 이용 가능했고요. 아무튼 5분 단위로 알림을 받으려면 결제해야 하네요! 여러 가지로 감사합니다! 잘 쓸게요."</p>
            <p className="review-author">실제 사용자 리뷰</p>
          </div>
          <div className="review-card">
            <p className="review-text">"코인 투자에 정말 좋은 앱입니다. 편하고 실시간 정보가 매우 유용해요!"</p>
            <p className="review-author">실제 사용자 리뷰</p>
          </div>
          <div className="review-card">
            <p className="review-text">"매번 항상 만족스럽게 이용 중이네요. 결제까지 해서 잘 쓰고 있고요! 예측 데이터가 있어 다른 동종 어플에 비해 신뢰도도 있고 쓰기도 좋았습니다. 초보여서 아무것도 몰랐는데 큐스피 코인 쓰면서 많이 실력도 늘었어요. 꼭 써보실 만한 좋은 앱이니까 한번 써보세요. 강추 드립니다!"</p>
            <p className="review-author">실제 사용자 리뷰</p>
          </div>
        </div>
      </div>

      <div className="page-footer">
        <div className="footer-links">
          <a href="/howto">앱 사용방법</a>
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> <a href="/terms-and-conditions-ios-ko.html">이용약관</a>
          <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span> <a href="/privacy-policy-ios-ko.html">개인정보 처리방침</a>
        </div>
        <div className="footer-info">
          <p>큐스피, 서울특별시 강남구 테헤란로77길 11-9 7층</p>
          <p>사업자등록번호 : 247-48-00824</p>
          <p>통신판매업신고번호 : 2022-서울강남-02419</p>
          <p>Copyright © 2025 QSPI Co. All rights reserved.</p>
        </div>
      </div>

      <button className="app-download-btn-floating" id="appDownloadBtnFloating" aria-label="큐스피 코인 앱 다운로드">
        앱 다운로드
      </button>

      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener("DOMContentLoaded", function() {
            const featureBoxes = document.querySelectorAll('.feature-box');
            const featureObserverOptions = {
              root: null,
              rootMargin: '0px',
              threshold: 0.2
            };

            const featureObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('active');
                  entry.target.style.transitionDelay = \`\${Array.from(featureBoxes).indexOf(entry.target) * 0.15}s\`;
                  observer.unobserve(entry.target);
                }
              });
            }, featureObserverOptions);

            featureBoxes.forEach((box) => {
              featureObserver.observe(box);
            });

            const screenshotSections = document.querySelectorAll('.screenshot-section.scroll-animate');
            const screenshotObserverOptions = {
              root: null,
              rootMargin: '0px',
              threshold: 0.1
            };

            const screenshotObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.target === screenshotSections[0]) {
                  return;
                }

                if (entry.isIntersecting) {
                  entry.target.classList.add('active');
                  observer.unobserve(entry.target);
                }
              });
            }, screenshotObserverOptions);

            screenshotSections.forEach((section, index) => {
              if (index !== 0) {
                screenshotObserver.observe(section);
              }
            });

            const reviewCardsContainer = document.getElementById('reviewCardsContainer');
            let isDown = false;
            let startX;
            let scrollLeft;

            reviewCardsContainer.addEventListener('mousedown', (e) => {
              isDown = true;
              reviewCardsContainer.classList.add('active');
              startX = e.pageX - reviewCardsContainer.offsetLeft;
              scrollLeft = reviewCardsContainer.scrollLeft;
            });

            reviewCardsContainer.addEventListener('mouseleave', () => {
              isDown = false;
              reviewCardsContainer.classList.remove('active');
            });

            reviewCardsContainer.addEventListener('mouseup', () => {
              isDown = false;
              reviewCardsContainer.classList.remove('active');
            });

            reviewCardsContainer.addEventListener('mousemove', (e) => {
              if (!isDown) return;
              e.preventDefault();
              const x = e.pageX - reviewCardsContainer.offsetLeft;
              const walk = (x - startX) * 2;
              reviewCardsContainer.scrollLeft = scrollLeft - walk;
            });

            reviewCardsContainer.addEventListener('touchstart', (e) => {
              isDown = true;
              startX = e.touches[0].pageX - reviewCardsContainer.offsetLeft;
              scrollLeft = reviewCardsContainer.scrollLeft;
            });

            reviewCardsContainer.addEventListener('touchend', () => {
              isDown = false;
            });

            reviewCardsContainer.addEventListener('touchmove', (e) => {
              if (!isDown) return;
              const x = e.touches[0].pageX - reviewCardsContainer.offsetLeft;
              const walk = (x - startX) * 2;
              reviewCardsContainer.scrollLeft = scrollLeft - walk;
            });

            const iosAppStoreUrl = "https://apps.apple.com/kr/app/id1641223890";
            const androidPlayStoreUrl = "https://play.google.com/store/apps/details?id=com.qspi.crt&hl=ko&utm_source=landing&utm_medium=website&utm_campaign=launch";

            function isIOS() {
              return /iPhone|iPad|iPod/i.test(navigator.userAgent);
            }
            function isAndroid() {
              return /Android/i.test(navigator.userAgent);
            }
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) !== 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-11483991186/1vjmCIOyzt4aEJKZ_-Mq',
                'event_callback': callback
              });
              return false;
            }

            document.getElementById("appDownloadBtnFloating").addEventListener("click", () => {
              if (isIOS()) {
                gtag_report_conversion(iosAppStoreUrl);
              } else if (isAndroid()) {
                gtag_report_conversion(androidPlayStoreUrl);
              } else {
                gtag_report_conversion(androidPlayStoreUrl);
              }
            });
          });
        `
      }} />
    </>
  );
}
