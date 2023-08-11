import React, { MouseEvent } from "react";
import styled from "styled-components";
import { SSColors } from "../colors";
import { SSFonts } from "../fonts";
import { CustomComponentSymbol } from "../CustomComponentSymbol";
import { SSButtonGhost } from "../buttons";

type BasicRowProps = {
  image?: string;
  title: string;
  description?: string;
  onClick?: () => void;
  customTitle?: boolean;
  customDescription?: boolean;

  tinyDescription?: boolean;
  onEdit?: () => void;
};

const Root = styled.div`
  position: relative;
  background-color: white;
  transition: all 0.1s;
  padding: 12px;

  &:hover {
    background-color: ${SSColors.black5};
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    .EditContainer {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ImageContainer = styled.div<BasicRowProps>`
  position: relative;
  box-sizing: border-box;
  background: ${SSColors.black10};
  width: 52px;
  height: 52px;
  pointer-events: none;
  padding: 2px;
  flex: 0 0 auto;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TextContainer = styled.div`
  pointer-events: none;
  min-width: 0;
  flex: 1 1 auto;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const Title = styled.div<{ custom?: boolean }>`
  ${SSFonts.label};
  color: ${(p) => (p.custom ? SSColors.purple : "black")};
`;

const Description = styled.div<{ tinyDescription?: boolean; custom?: boolean }>`
  ${(p) => (p.tinyDescription ? SSFonts.body4 : SSFonts.body)};
  color: ${(p) => (p.custom ? SSColors.purple : SSColors.black40)};
  line-height: 1;
`;

const EditContainer = styled.div`
  opacity: 0;
  visibility: hidden;
`;

export const SSBasicRow: React.FC<BasicRowProps> = (props) => {
  return (
    <Root onClick={props.onClick}>
      <ImageContainer {...props}>
        {props.image && <Image src={props.image} />}
      </ImageContainer>
      <TextContainer>
        <TitleContainer>
          {props.customTitle && <CustomComponentSymbol />}
          <Title custom={props.customTitle}>{props.title}</Title>
        </TitleContainer>
        <DescriptionContainer>
          {props.description && (
            <>
              {props.customDescription && <CustomComponentSymbol size={4} />}
              <Description
                tinyDescription={props.tinyDescription}
                custom={props.customDescription}
              >
                {props.description}
              </Description>
            </>
          )}
        </DescriptionContainer>
      </TextContainer>
      {props.onEdit && (
        <EditContainer className={"EditContainer"}>
          <SSButtonGhost
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();

              props.onEdit?.();
            }}
          >
            Edit
          </SSButtonGhost>
        </EditContainer>
      )}
    </Root>
  );
};
