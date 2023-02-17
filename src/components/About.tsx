import React from "react";

type Props = {
  reverse: boolean;
  heading: string;
  data: string;
  image: string;
};

const About = ({ reverse, heading, data, image }: Props) => {
  return (
    <section className="flex items-center justify-between w-full space-x-16">
      {reverse ? (
        <>
          <img
            src={image}
            alt={heading}
            className="h-64 w-96 object-contain rounded-lg"
          />

          <div className="flex flex-col space-y-1">
            <h1 className="text-gray-50 font-2xl font-bold">{heading}</h1>
            <p className="text-sm">{data}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col space-y-1">
            <h1 className="text-gray-50 font-2xl font-bold">{heading}</h1>
            <p className="text-sm">{heading}</p>
          </div>
          <img
            src={image}
            alt={heading}
            className="h-64 w-96 object-contain rounded-lg"
          />
        </>
      )}
    </section>
  );
};

export default About;
