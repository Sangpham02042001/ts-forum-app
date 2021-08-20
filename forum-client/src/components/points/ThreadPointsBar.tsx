import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { useWindowDimension } from "../../hooks/useWindowDimensions";

export interface ThreadPointsBarProps {
  points: number;
  responseCount?: number;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
}) => {
  const { width } = useWindowDimension();
  if (width > 768) {
    return (
      <div className="threadcard-points">
        <div className="threadcard-points-item">
          {points}
          <br />
          <FontAwesomeIcon icon={faHeart} className="points-icon" />
        </div>
        <div className="threadcard-points-item">
          {responseCount}
          <br />
          <FontAwesomeIcon icon={faReplyAll} className="points-icon" />
        </div>
      </div>
    );
  }
  return null;
};

export default ThreadPointsBar;
