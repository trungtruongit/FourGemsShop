import { Box, Button, Container, MenuItem, styled } from "@mui/material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { ArrowLeft, KeyboardArrowDown } from "@mui/icons-material";
import BazaarCard from "components/BazaarCard";
import { FlexBox } from "components/flex-box";
import NavLink from "components/nav-link/NavLink";
import MegaMenu from "./MegaMenu";
import MegaMenu2 from "./MegaMenu2";
import useSettings from "hooks/useSettings";
import navbarNavigations from "data/navbarNavigations"; // NavList props interface
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// const common css style
const navLinkStyle = {
    cursor: "pointer",
    transition: "color 150ms ease-in-out",
    color: "#FFFFFF",
    "&:hover": {
        color: "primary.main",
    },
    "&:last-child": {
        marginRight: 0,
    },
}; // style components

const StyledNavLink = styled(NavLink)(() => ({ ...navLinkStyle }));
const ParentNav = styled(Box)(({ theme }) => ({
    "&:hover": {
        color: theme.palette.primary.main,
        "& > .parent-nav-item": {
            display: "block",
        },
    },
}));
const ParentNavItem = styled(Box)(({ theme }) => ({
    top: 0,
    zIndex: 5,
    left: "100%",
    paddingLeft: 8,
    display: "none",
    position: "absolute",
    [theme.breakpoints.down(1640)]: {
        right: "100%",
        left: "auto",
        paddingRight: 8,
    },
}));
const NavBarWrapper = styled(BazaarCard)(({ theme, border }) => ({
    height: "60px",
    display: "block",
    fontSize: "17px",
    backgroundColor: "#984465",
    borderRadius: "0px",
    position: "relative",
    ...(border && {
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),
    [theme.breakpoints.down(1150)]: {
        display: "none",
    },
}));
const InnerContainer = styled(Container)(() => ({
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
}));
const ChildNavsWrapper = styled(Box)(() => ({
    zIndex: 5,
    left: "50%",
    top: "100%",
    display: "none",
    position: "absolute",
    transform: "translate(-50%, 0%)",
})); // ==========================================================

// ==========================================================
const NavbarQC = ({ navListOpen, hideCategories, elevation, border }) => {
    const { settings } = useSettings();
    const [role, setRole] = useState("");
    useEffect(() => {
        const decoded = jwtDecode(token);
        const role = decoded?.role;
        setRole(role);
    }, []);
    const renderNestedNav = (list = [], isRoot = false) => {
        return list.map((nav) => {
            if (isRoot) {
                // show megamenu
                if (nav.megaMenu) {
                    return (
                        //@ts-ignore
                        <MegaMenu
                            key={nav.title}
                            title={nav.title}
                            menuList={nav.child}
                        />
                    );
                } // show megamenu with sub
                if (nav.megaMenuWithSub) {
                    return (
                        //@ts-ignore
                        <MegaMenu2
                            key={nav.title}
                            title={nav.title}
                            menuList={nav.child}
                        />
                    );
                }

                if (role == "staff") {
                    if (
                        (nav.url && nav.withStaff === true) ||
                        nav.common === true
                    ) {
                        return (
                            <StyledNavLink href={nav.url} key={nav.title}>
                                {nav.title}
                            </StyledNavLink>
                        );
                    }
                } else {
                    if (
                        (nav.url && nav.withStaff === false) ||
                        nav.common === true
                    ) {
                        return (
                            <StyledNavLink href={nav.url} key={nav.title}>
                                {nav.title}
                            </StyledNavLink>
                        );
                    }
                }
                if (nav.child) {
                    return (
                        <FlexBox
                            key={nav.title}
                            alignItems="center"
                            position="relative"
                            flexDirection="column"
                            sx={{
                                "&:hover": {
                                    "& > .child-nav-item": {
                                        display: "block",
                                    },
                                },
                            }}
                        >
                            <FlexBox
                                alignItems="flex-end"
                                gap={0.3}
                                sx={navLinkStyle}
                            >
                                {nav.title}{" "}
                                <KeyboardArrowDown
                                    sx={{
                                        color: "grey.500",
                                        fontSize: "1.1rem",
                                    }}
                                />
                            </FlexBox>

                            <ChildNavsWrapper className="child-nav-item">
                                <BazaarCard
                                    elevation={3}
                                    sx={{
                                        mt: 2.5,
                                        py: 1,
                                        minWidth: 200,
                                    }}
                                >
                                    {renderNestedNav(nav.child)}
                                </BazaarCard>
                            </ChildNavsWrapper>
                        </FlexBox>
                    );
                }
            } else {
                if (nav.url) {
                    return (
                        <NavLink href={nav.url} key={nav.title}>
                            <MenuItem>{nav.title}</MenuItem>
                        </NavLink>
                    );
                }

                if (nav.child) {
                    return (
                        <ParentNav
                            position="relative"
                            minWidth="230px"
                            key={nav.title}
                        >
                            <MenuItem color="grey.700">
                                <Box flex="1 1 0" component="span">
                                    {nav.title}
                                </Box>

                                {settings.direction === "ltr" ? (
                                    <ArrowRight fontSize="small" />
                                ) : (
                                    <ArrowLeft fontSize="small" />
                                )}
                            </MenuItem>

                            <ParentNavItem className="parent-nav-item">
                                <BazaarCard
                                    sx={{
                                        py: "0.5rem",
                                        minWidth: "230px",
                                    }}
                                    elevation={3}
                                >
                                    {renderNestedNav(nav.child)}
                                </BazaarCard>
                            </ParentNavItem>
                        </ParentNav>
                    );
                }
            }
        });
    };

    return (
        <NavBarWrapper
            hoverEffect={false}
            elevation={elevation}
            border={border}
        >
            {hideCategories ? (
                <InnerContainer>
                    {/* Horizontal menu */}
                    <FlexBox gap={4}>
                        {renderNestedNav(navbarNavigations, true)}
                    </FlexBox>
                </InnerContainer>
            ) : (
                <InnerContainer
                    sx={{
                        justifyContent: "center",
                    }}
                >
                    <FlexBox gap={4}>
                        {renderNestedNav(navbarNavigations, true)}
                    </FlexBox>
                </InnerContainer>
            )}
        </NavBarWrapper>
    );
}; //  set default props data

NavbarQC.defaultProps = {
    elevation: 2,
    navListOpen: false,
    hideCategories: false,
};
export default NavbarQC;
