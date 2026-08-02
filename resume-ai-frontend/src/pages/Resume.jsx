import React from "react";

function Resume({ data }) {
  if (!data) {
    return <h1 className="text-white text-2xl">No resume data found</h1>;
  }

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">
        {data.personalInformation?.fullName}
      </h1>

      <p>{data.personalInformation?.email}</p>
      <p>{data.personalInformation?.phoneNumber}</p>
      <p>{data.personalInformation?.location}</p>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold">Summary</h2>
      <p>{data.summary}</p>
    </div>
  );
}

export default Resume;