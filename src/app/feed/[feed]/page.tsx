"use client"

import { useEffect, useState } from "react";
import Stories from "../../Stories";
import { fetchFeedMeta, RSSFeedMeta } from "@/lib/fetchRSS";
import { faviconUrl } from "@/lib/helpers";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscriptionsAtom } from "@/lib/state";
import { useAtom } from "jotai";


export default function FeedPage({ params }: { params: { feed: string } }) {
  const [feedMeta, setFeedMeta] = useState<RSSFeedMeta | null>(null)
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  useEffect(() => {
    async function request() {
      const feedMeta = await fetchFeedMeta(decodeURIComponent(params.feed))
      if (feedMeta) {
        setFeedMeta(feedMeta)
      }
    }

    request()
  }, [])

  // TODO should be a loading indicator instead
  if (!feedMeta) {
    return <div></div>
  }

  return (
    <div>
      {/* feed cover image */}
      {/* commented next line because of horrendous result */}
      {/* {feedMeta?.image && <img src={feedMeta?.image} alt="" className="w-full rounded-md mb-6" />} */}
      <div className="flex mb-10">
        {/* webiste favicon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={faviconUrl(feedMeta?.link ?? "")} alt="" className="aspect-square w-20 h-20 object-cover rounded-md mr-4" />
        <div>
          <h1 className="font-semibold text-2xl flex items-center gap-2"><a href={feedMeta?.link} target="_blank" className="hover:underline">{feedMeta?.title}</a><SquareArrowOutUpRight className="w-5 h-5" /></h1>
          <p>{feedMeta?.url}</p>
          <p className="mb-4">{feedMeta?.description}</p>
          {subscriptions.find(s => s.url === decodeURIComponent(params.feed)) ?
            <Button onClick={() => setSubscriptions(subscriptions.filter(s => s.url !== feedMeta.url))} variant="outline">Unsubscribe</Button> :
            <Button onClick={() => setSubscriptions([{ name: feedMeta.title, url: feedMeta.url }, ...subscriptions])}>Subscribe</Button>
          }
        </div>
      </div>
      <Stories feeds={[decodeURIComponent(params.feed)]} />
    </div>
  )
}