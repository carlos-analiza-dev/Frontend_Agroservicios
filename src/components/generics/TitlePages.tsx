import React from "react";

interface Props {
  title: string;
}

const TitlePages = ({ title }: Props) => {
  return <h1 className="text-lg md:text-2xl font-bold">{title}</h1>;
};

export default TitlePages;
