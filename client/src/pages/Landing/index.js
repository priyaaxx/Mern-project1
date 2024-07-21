import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Box,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loadersSlice';
import { useNavigate } from 'react-router-dom';
import { SetUser } from '../../redux/usersSlice';
import { GetCurrentUser } from '../../apicalls/users';

const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
    fontFamily: 'Montserrat, sans-serif',
}));

const Navbar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(45deg, #f8bbd0 30%, #ec407a 90%)',
}));

const Title = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
    fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer',
}));

const Section = styled(Container)(({ theme }) => ({
    padding: theme.spacing(4, 0),
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
    position: 'relative',
    marginTop: '15px',
    height: '550px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: 'url(/images/clothes.jpg)',
}));

const OverlayBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '40%',
    height: '270px',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'Montserrat, sans-serif',
}));

const TrendingGrid = styled(Grid)(({ theme }) => ({
    marginTop: theme.spacing(4),
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
}));

const ImageContainer = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
        boxShadow: theme.shadows[5],
    },
}));

const Image = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const Footer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    background: 'linear-gradient(45deg, #f8bbd0 30%, #ec407a 90%)',
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat, sans-serif',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.dark,
    fontWeight: 'bold',
    fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer',
}));

const GiftOfThriftSection = styled(Section)(({ theme }) => ({
    backgroundColor: '#f8bbd0',
}));

const WhitePaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#ffffff',
    height: '100%',
}));

const ThriftFirstTimeContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    height: '400px',
}));

const PinkBox = styled(Box)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.light} 30%, ${theme.palette.primary.dark} 90%)`,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: '#ffffff',
    fontFamily: 'Montserrat, sans-serif',
    width: '50%',
}));

const ThriftImage = styled('img')({
    width: '50%',
    height: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
});

const LandingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(SetLoader(true));
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(SetLoader(false));
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
        }
    }, []);

    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCurrentUser();
            dispatch(SetLoader(false));
            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                console.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            console.error(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    const handleCategoryClick = (category) => {
        if (user) {
            const formattedCategory = category.toLowerCase().replace(/\s+/g, '');
            navigate(`/${formattedCategory}`);
        } else {
            setOpenLoginDialog(true);
        }
    };

    const handleCloseLoginDialog = () => {
        setOpenLoginDialog(false);
    };

    return (
        <Root>
            {/* Navbar */}
            <Navbar position="static">
                <Toolbar>
                    <Title variant="h6" onClick={() => navigate("/home")}>ThriftIt</Title>
                    {['Men', 'Women', 'Kids', 'Accessories', 'Footwear'].map((category) => (
                        <Button key={category} color="inherit" onClick={() => handleCategoryClick(category)}>{category}</Button>
                    ))}
                    <Box sx={{ flexGrow: 1 }} />
                    <Button color="inherit" href="/login">Login</Button>
                    <Button color="inherit" href="/register">Register</Button>
                </Toolbar>
            </Navbar>

            {/* Background Image with Overlay Box */}
            <BackgroundImage>
                <OverlayBox>
                    <Typography variant="h4">Be unique, be eco-chic.</Typography>
                    <Typography variant="body1">
                    Are you tired of spending a fortune on trendy clothes that everyone else is wearing? Say hello to ThriftIt, your ultimate destination for unique, stylish, and budget-friendly fashion! ThriftIt is not just a platform; it's a treasure hunt where every click brings you closer to a fabulous find. Imagine snagging that vintage denim jacket or the perfect little black dress for a fraction of the price! Plus, you're doing the planet a favor by reducing waste and supporting sustainable fashion. With ThriftIt, you can refresh your wardrobe without breaking the bank, all while discovering one-of-a-kind pieces that express your unique style. So why wait? Dive into the world of ThriftIt and start thrifting your way to a fabulous wardrobe today!
                    </Typography>
                </OverlayBox>
            </BackgroundImage>

            {/* Explore Trending Today */}
            <Section>
                <SectionTitle variant="h4" align="center" gutterBottom style={{ marginBottom: '20px', color: '#ec407a' }}>
                    Hot Right Now
                </SectionTitle>
                <TrendingGrid container spacing={4}>
                    {['Crop Tops', 'Solid Shirts', 'Korean Trousers', 'Dresses'].map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item}>
                            <ImageContainer onClick={() => handleCategoryClick(item)}>
                                <Image src={`/images/${item.toLowerCase().replace(/\s+/g, '-')}.jpg`} alt={item} />
                            </ImageContainer>
                            <Typography variant="h6" align="center" gutterBottom>
                                {item}
                            </Typography>
                        </Grid>
                    ))}
                </TrendingGrid>
            </Section>

            <GiftOfThriftSection>
                <Typography variant="h4" align="center" gutterBottom style={{ color: '#ffffff' }}>
                    #GiftofThrift
                </Typography>
                <Grid container spacing={4}>
                    {[
                        {
                            title: 'Become a fashionista for less',
                            description: 'Thrift stores are like bursting treasure chests overflowing with amazing clothes and accessories. You can snag designer labels for a fraction of the price, so get ready to have your wallet do a happy dance while you build a wardrobe that will make your friends green with envy (the good kind of green, like envy mixed with a touch of admiration for your mad thrifting skills).'
                        },
                        {
                            title: 'Become a sustainability superhero',
                            description: 'Fast fashion is kind of like a villain in the fight for a healthy planet. But thrifting is your superpower! By giving pre-loved items a second chance, you are diverting mountains of clothes from overflowing landfills and dramatically reducing the environmental impact of your wardrobe. Plus, you get major bragging rights – you are saving the world, one thrifted t-shirt at a time.'
                        },
                        {
                            title: 'Embark on a thrilling fashion adventure',
                            description: 'Forget predictable shopping trips! Thrifting is like an exciting treasure hunt. You never know what hidden gems you might unearth. Maybe it is a perfectly preserved vintage dress that will make you look like a movie star from a bygone era. Or perhaps it is a funky lamp that will add a touch of whimsy to your living room. Every thrifting trip is a chance to discover something totally unique and special – it is like a choose-your-own-adventure story for your wardrobe and home!'
                        },
                    ].map((benefit, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <WhitePaper>
                                <Box p={2}>
                                    <Typography variant="h6" align="center">{benefit.title}</Typography>
                                    <Typography variant="body1">{benefit.description}</Typography>
                                </Box>
                            </WhitePaper>
                        </Grid>
                    ))}
                </Grid>
            </GiftOfThriftSection>


            {/* First Time Thrifting */}
            <Section>
                <Typography variant="h4" align="center" gutterBottom style={{ color: '#ec407a' }}>
                    First Time Thrifting?
                </Typography>
                <ThriftFirstTimeContainer>
                    <PinkBox>
                        <Typography variant="h6" gutterBottom>Welcome to the thrift side</Typography>
                        <Typography variant="body1">
                        Sell your gently used clothes on ThriftIt or buy from someone else. It's easy, fun, and sustainable.
                        </Typography>
                    </PinkBox>
                    <ThriftImage src="/images/thrifting.jpg" alt="Thrifting" />
                </ThriftFirstTimeContainer>
            </Section>

            {/* Footer */}
            <Footer>
                <Typography variant="body2">ThriftIt © {new Date().getFullYear()}</Typography>
            </Footer>

            {/* Login Dialog */}
            <Dialog open={openLoginDialog} onClose={handleCloseLoginDialog}>
                <DialogTitle>Login Required</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You need to log in to continue.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseLoginDialog} color="primary">Okay</Button>
                    {/* <Button onClick={() => setOpenLoginDialog(false)} color="primary">Login</Button> */}
                </DialogActions>
            </Dialog>
        </Root>
    );
};

export default LandingPage;
