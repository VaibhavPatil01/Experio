import { Helmet } from 'react-helmet';
import Hero from '../components/Hero';
import GithubSection from '../components/GithubSection';
import Footer from '../components/Footer';
import OurTeam from '../components/OurTeam';
import homePageImage from '../assets/images/pages/home-page.png';
import { Testimonials } from '../components/Testimonials';
import { CallToAction } from '../components/CallToAction';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Experio</title>
        <meta
          name="description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta name="twitter:card" content={homePageImage} />
        <meta name="twitter:title" content="Experio" />
        <meta
          name="twitter:description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta name="twitter:image" content={homePageImage} />

        <meta property="og:title" content="Experio" />
        <meta
          property="og:description"
          content="Share and discover interview experiences on Experio to inspire and learn from the community."
        />
        <meta property="og:image" content={homePageImage} />
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
