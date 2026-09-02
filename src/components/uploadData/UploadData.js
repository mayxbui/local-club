import React, { useEffect } from 'react';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';
import LocalsData from '../locals/LocalsData';
import DealsData from '../deals/DealsData';

const UploadLocals = () => {
  useEffect(() => {
    const uploadData = async () => {
      try {
        const localsRef = collection(db, 'Locals');
        for (const local of LocalsData) {
          await addDoc(localsRef, local);
          console.log(`Uploaded Local: ${local.name}`);
        }

        const dealsRef = collection(db, 'Deals');
        for (const deal of DealsData) {
          await addDoc(dealsRef, deal);
          console.log(`Uploaded Deal: ${deal.title}`);
        }

        console.log("All Locals and Deals uploaded successfully!");
      } catch (error) {
        console.error("Error uploading data: ", error);
      }
    };

    uploadData();
  }, []);

  return <div>Uploading Locals and Deals... Check console logs.</div>;
};

export default UploadLocals;
