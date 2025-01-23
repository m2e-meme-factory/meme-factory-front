import { Card } from "@radix-ui/themes";
import React, { useState } from "react";
import styled from "styled-components";

interface VideoCardProps {
    videoSrc: string; // URL видео
    thumbnailSrc: string; // URL превью
    altText?: string; // Альтернативный текст для превью
}

const BoucingButton = styled.button`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 12px 15px;
    background: rgba(0, 0, 0, 0.7);
    color: #fecf0a;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    animation: bounce 3s ease-in-out infinite alternate;

    /* transform: scale(1); */
    @keyframes bounce {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }

    50% {
        transform: translate(-50%, -50%) scale(1.2);
    }

    100% {
        transform: translate(-50%, -50%) scale(1);
    }
    }
`

const VideoCard: React.FC<VideoCardProps> = ({ videoSrc, thumbnailSrc, altText = "Video preview" }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true); // Меняем состояние, чтобы заменить превью на видео
    };

    return (
        <Card style={{
            padding: "0",
            position: "relative",
            maxWidth: "640px",
            overflow: "hidden",
            width: "100%",
        }}>
            {!isPlaying ? (
                <div style={{ position: "relative", cursor: "pointer" }}
                    onClick={handlePlay}>
                    {/* Превью видео */}
                    <img
                        src={thumbnailSrc}
                        alt={altText}
                        style={{
                            width: "100%",
                            display: "block",
                        }}
                    />
                    {/* Кнопка Play */}
                    <BoucingButton
                        aria-label="Play Video"
                    >
                        ▶
                    </BoucingButton>
                </div>
            ) : (
                // Видео создается только после клика
                <video
                    playsInline
                    controls
                    autoPlay
                    loop={false}
                    muted={true}
                    src={videoSrc}
                    onEnded={() => {
                        console.log("Video ended");
                        setIsPlaying(false);
                    }}
                    style={{
                        width: "100%",
                        display: "block",
                    }}
                />

            )}
        </Card>
    );
};

export default VideoCard;

// https://cd26602-wordpress-ejcc2.tw1.ru/wp-content/themes/oceanwp/assets/img/bg-vid.mp4
// https://cd26602-wordpress-ejcc2.tw1.ru/wp-content/themes/oceanwp/assets/img/bg1.png