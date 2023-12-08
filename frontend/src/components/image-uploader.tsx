"use client";

import * as LR from "@uploadcare/blocks";
import { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";

const ImageUploader = () => {
  LR.registerBlocks(LR);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDatautput = (e: any) => {
      console.log("event", e);
    };

    const element = ref.current;

    element?.addEventListener("lr-data-output", handleDatautput);

    return () => {
      element?.removeEventListener("lr-data-output", handleDatautput);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dodaj zdjęcie</CardTitle>
        <lr-config
          ctx-name="my-uploader"
          pubkey="583e97ddcf27692cf5d5"
          maxLocalFileSizeBytes={10000000}
          multiple={false}
          imgOnly={true}
        ></lr-config>
        <lr-file-uploader-minimal
          css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.25.0/web/lr-file-uploader-minimal.min.css"
          ctx-name="my-uploader"
          class="my-config"
        ></lr-file-uploader-minimal>
        <lr-data-output
          ref={ref}
          ctx-name="my-uploader"
          use-console
          use-input
          use-group
          use-event
        ></lr-data-output>
        {/* <lr-upload-ctx-provider
          ctx-name="my-uploader"
          ref={ref}
          onEvent={(e) => {
            console.log(e);
          }}
        ></lr-upload-ctx-provider> */}
      </CardHeader>
    </Card>
  );
};

export default ImageUploader;
