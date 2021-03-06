import React, { useRef } from "react"
import Img from "gatsby-image"
import hexToRgba from 'hex-to-rgba';
import styled from 'styled-components'
import { TransitionState } from "gatsby-plugin-transition-link";
import { motion, useCycle } from "framer-motion"

import { colors } from '../styles/colors'
import { spacing } from '../styles/spacing'
import { Giant, Large, Schmedium, Regular } from "../styles/typography"

const CustomImg = styled(Img)`
  height: 100%;
  position: absolute;
  width: 100%;
`

const ThumbnailInner = styled(motion.div)`
  border-radius: 8px;
  box-shadow: 0 0 0 ${props => props.shadowInitial};
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.25s ease-in-out;

  @media (hover: hover) {
    &:hover {
      box-shadow: 0 16px 40px ${props => props.shadowHover};
    }
  }

  @media (min-width: 1200px) {
    border-radius: 16px;
  }
`

const ProjectTitle = styled.h2`
  color: ${colors.gray300};
  ${Large}
  margin-top: ${spacing.s300};
  text-decoration: none;
  transition: color 0.5s;

  @media (hover: hover) {
    &:hover {
      color: ${colors.blue};
    }
  }

  @media (min-width: 768px) {
    margin-top: ${spacing.s600};
  }

  @media (min-width: 1024px) {
    ${Giant}
  }
`

const ProjectDescription = styled.p`
  color: ${colors.gray200};
  ${Regular}
  margin-top: ${spacing.s000};

  @media (min-width: 1024px) {
    ${Schmedium}
  }
`

const ProjectThumbnail = (props) => {
  const containerRef = useRef(null);
  var newTop, newXPos = 0;
  if(containerRef.current !== undefined && containerRef.current !== null) {
    const navbar = document.querySelector('header')
    const navbarDimensions = navbar.getBoundingClientRect()
    const distanceToTop =
    containerRef.current.getBoundingClientRect().top - navbarDimensions.height
    newTop = distanceToTop * -1;

    if(typeof window !== 'undefined') {
      if(window.innerWidth <= 1024) {
        newXPos = -24;
      } else {
        newXPos = ((window.innerWidth - containerRef.current.getBoundingClientRect().width)/2) * -1;
      }
    }
  }

  const projectVariants = {
    exiting: (custom) => ({
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.8,
        ease: [0.42, 0, 0.58, 1],
      }
    }),
    end: (custom) => ({
      opacity: 1,
      y: custom.newTop,
      transition: {
        delay: 0.15,
        duration: 0.8,
        ease: [1,-0.5,.25,1.25],
      }
    })
  }

  const thumbnailVariants = {
    start: {
      height: 'auto',
      width: 'auto'
    },
    end: (custom) => ({
      x: custom.newXPos,
      height: 'calc(100vh - 124px)',
      borderRadius: '0px',
      width: '100vw',
      transition: {
        delay: 0.9,
        duration: 0.25,
        ease: [0.65, 0.01, 0.5, 1],
      }
    })
  }

  const thumbnailTitleVariants = {
    entered: {
      opacity: 1,
    },
    exited: {
      opacity: 0
    }
  }

  const [thumbnailStatus, cycleThumbStatus] = useCycle('start', 'end');

  return (
    <TransitionState>
      {({mount, transitionStatus}) => {
        return (
          <motion.div
            initial={false}
            variants={projectVariants}
            animate={thumbnailStatus === 'end' ? thumbnailStatus : transitionStatus}
            custom={{
              newTop: newTop,
            }}
            ref={containerRef}
            onClick={() => cycleThumbStatus()}
          >
            <ThumbnailInner
              initial='start'
              variants={thumbnailVariants}
              animate={transitionStatus}
              custom={{
                newXPos: newXPos,
              }}
              whileHover={{
                scale: 1.005,
                transition: { duration: 0.25 },
              }}
              whileTap={{ scale: 1 }}
              shadowInitial={hexToRgba(props.card.hex, '0')}
              shadowHover={hexToRgba(props.card.hex, '0.3')}
            >
              <CustomImg
                alt={props.card.alt}
                fluid={props.card.image.childImageSharp.fluid} 
              />
            </ThumbnailInner>
            <motion.div
              variants={thumbnailTitleVariants}
              animate={transitionStatus}
              css={`
                padding: 0 ${spacing.s400};

                @media (min-width: 768px) {
                  padding: 0 ${spacing.s600};
                }
              `}
            >
              <ProjectTitle>{props.card.client}</ProjectTitle>
              <ProjectDescription>{props.card.description}</ProjectDescription>
            </motion.div>
          </motion.div>
        )
      }}
    </TransitionState>
  )
}

export default ProjectThumbnail
