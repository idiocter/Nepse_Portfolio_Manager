import { useEffect, useRef } from 'react';

const TechnicalAnalysisWidget = ({ symbol }) => {
    const containerRef = useRef();

    useEffect(() => {
        // Clear any existing widget
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            interval: "1D",
            width: "100%",
            isTransparent: true,
            height: "100%",
            symbol: `NEPSE:${symbol}`,
            showIntervalTabs: true,
            displayMode: "single",
            locale: "en",
            colorTheme: "light"
        });

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        // Cleanup function to remove script when component unmounts
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [symbol]);

    return (
        <div className="tradingview-widget-container h-[300px] sm:h-[400px] lg:h-full w-full min-h-[250px]" ref={containerRef}>
            <div className="tradingview-widget-container__widget h-full w-full"></div>
            <div className="tradingview-widget-copyright invisible h-0 overflow-hidden">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">Track all markets on TradingView</span>
                </a>
            </div>
        </div>
    );
};

export default TechnicalAnalysisWidget;