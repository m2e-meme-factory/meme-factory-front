import styled from "styled-components";

const IMAGE_URL = 'https://cdna.artstation.com/p/assets/images/images/012/308/904/large/divya-jain-firewatch-dhj.jpg?1534140299';

const BannerContainer = styled.div`
    width: 100%;
    height: 100px;
    overflow: hidden;
    margin: 0;
    padding: 0;
`;

const BannerImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Banner = () => {
    return (
        <BannerContainer>
            <BannerImage src={IMAGE_URL} alt="Banner Image" />
        </BannerContainer>
    );
}

export default Banner;
