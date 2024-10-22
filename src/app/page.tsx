import { Suspense } from 'react'
import { Component } from "@/components/component";

export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Component />
    </Suspense>
  );
}
