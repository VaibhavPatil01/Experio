import { Helmet } from 'react-helmet';
import Hero from '../../components/home/Hero';
import GithubSection from '../../components/home/GithubSection';
import Footer from '../../components/common/Footer';
import OurTeam from '../../components/home/OurTeam';
import { assets } from '../../assets/assets';
import { Testimonials } from '../../components/home/Testimonials';
import { CallToAction } from '../../components/home/CallToAction';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Experio</title>
        <meta
          name="description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta name="twitter:card" content={assets.homePageImage} />
        <meta name="twitter:title" content="Experio" />
        <meta
          name="twitter:description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta name="twitter:image" content={assets.homePageImage} />

        <meta property="og:title" content="Experio" />
        <meta
          property="og:description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta property="og:image" content={assets.homePageImage} />
        <meta property="og:url" content={`${import.meta.env.REACT_APP_BASE_CLIENT_URL}`} />
        <meta property="og:type" content="website" />
      </Helmet>
      <Hero />
      <GithubSection />

        <Testimonials />
      <CallToAction />
      
      <Footer />
    </>
  );
};

export default Home;
