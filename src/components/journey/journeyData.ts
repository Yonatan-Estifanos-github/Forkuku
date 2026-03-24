export interface JourneyItem {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  callout?: string;
}

const CDN_BASE =
  'https://foxezhxncpzzpbemdafa.supabase.co/storage/v1/object/public/wedding-ui';

// URL-encodes the filename so spaces and special chars are safe in <img src>
const img = (filename: string) => `${CDN_BASE}/${encodeURIComponent(filename)}`;

export const JOURNEY_DATA: JourneyItem[] = [
  {
    id: 1,
    year: 'Early 2021',
    title: 'Zoom Prayer & IG Stalking',
    description:
      '[Saron] It started on a Covid Zoom prayer line. I was deeply moved by the absolute conviction in the way he prayed. Later, an Instagram request led me to notice this one guy stealing the spotlight in every photo. Turns out, it was Yoni. Those early DMs sparked something real, eventually leading to my very first trip to Harrisburg, PA.',
    image: img('firstime inPA2021.jpg'),
  },
  {
    id: 2,
    year: 'Late 2021',
    title: 'The Night It All Shifted',
    description:
      '[Yoni] Seeing her in person at The Gathering — a conference in DC brought together by multiple different ministries — I just remember that curly hair and thinking how beautiful she was. [Saron] Inspired by Jesus washing his disciples\u2019 feet, the conference ended with a foot-washing service. I hate feet, yet I somehow found myself washing Yoni\u2019s. That night shifted everything. We texted endlessly, leading to a December day where we finally confessed how we felt.',
    image: img('firsttime tellign each other w elike eachother2021.jpg'),
  },
  {
    id: 3,
    year: 'Feb 2022',
    title: 'The Recon Mission',
    description:
      '[Saron] Feelings were one thing — actually driving out to Harrisburg to find out if any of this was real was another. So I did. It was. [Yoni] We didn\'t want to rush it. We started fasting and praying, took things slow, and before long we were quietly dating. We celebrated her birthday that month with a surprise — our first real moment together as something more.',
    image: img('herbirthday2022feb.jpeg'),
  },
  {
    id: 4,
    year: 'Early 2022',
    title: 'Eight Hours & A Pause',
    description:
      '[Yoni] We went on an epic eight-hour hiking date, and the conversation just never ran dry. But despite the undeniable bond, we were both carrying unfinished business in our own lives. To protect what we had, we made the agonizingly tough call to step back for a year so God could do a real work in both of us.',
    image: img('hike_bothofus2022.jpg'),
  },
  {
    id: 5,
    year: 'May 2023',
    title: 'The Anchor Returns',
    description:
      '[Yoni] That year of silence wasn\u2019t easy, but it allowed the Lord to do a profound work in our hearts. When I looked out at my Penn State graduation and saw her sitting there\u2014invited by my family\u2014it hit me like a ton of bricks. The wait was over. I was finally ready.',
    image: img('2023mygrad.jpg'),
  },
  {
    id: 6,
    year: 'Summer 2023',
    title: "Abel & Hermela's Wedding",
    description:
      "[Saron] Before we even started dating, Hermella was the one who told me, \u2018Just go talk to him.\u2019 So standing by her side at her wedding, with Yoni right across the aisle as a groomsman, felt incredibly surreal. It was a hilarious, beautiful sneak peek at the future God was writing for us. [Yoni] I called Abel and begged him to get me paired to walk with her \u2014 lol thanks big dawg, I appreciate you for that.",
    image: img('abelandhermellawedding.jpg'),
  },
  {
    id: 7,
    year: 'Aug 5, 2023',
    title: 'The Vow Before The Vows',
    description:
      '[Yoni] I wasn\u2019t going to let her go again. In Philly, with her mother\u2019s blessing, sitting on the grass in front of the park \u2014 the LOVE sign was just for the photo \u2014 I told her that if we did this, we were doing it intentionally and walking straight toward forever. And for the first time, I told her I loved her. I had made a promise to myself that those words were only for my future wife. She was the first to hear them.',
    image: img('askingheroutPhilly.jpg'),
  },
  {
    id: 8,
    year: '2024',
    title: 'Surviving School',
    description:
      '[Yoni] With the foundation finally set, 2024 became a beautiful blur. I was deep into grad school, and she was finishing undergrad. [Saron] We kept our sanity by just doing life together. There was pure joy in simply surviving school side-by-side, knowing exactly who we were coming home to.',
    image: img('2024livignlife.JPG'),
  },
  {
    id: 9,
    year: '2024',
    title: 'Museum Escapes',
    description:
      '[Yoni] Between intense study sessions and planning for the future, we had to fiercely protect our time. Exploring museums became our sanctuary. These quiet dates were our favorite way to unplug, stop talking about exams, and just be completely present with each other.',
    image: img('lotsofmuseumdates24.JPEG'),
  },
  {
    id: 10,
    year: '2024',
    title: 'Catching Our Breath',
    description:
      '[Saron] Sometimes the weight of school meant we just needed to walk in the woods for a few hours. Those simple afternoon hikes became essential moments of rest. No matter how crazy our schedules got, we always found our way back to the quiet trails where our story first blossomed.',
    image: img('2024morehiking.jpg'),
  },
  {
    id: 11,
    year: '2024',
    title: 'Perfect Practice',
    description:
      '[Yoni] It felt like the year of weddings. We spent so many weekends dressing up and celebrating the love of our friends. But every time we stood in those crowds together, it felt like the perfect practice. We were getting a glimpse of the day we would finally be standing at the front.',
    image: img('2024moreweddings.jpeg'),
  },
  {
    id: 12,
    year: 'May 2025',
    title: 'Her Turn to Walk',
    description:
      "[Yoni] Watching her cross that stage was one of the proudest moments of my life. She worked incredibly hard for that degree \u2014 showing up every single day with grace and determination. This was her moment, fully earned, and I couldn\u2019t have been more proud to be in that crowd cheering her on.",
    image: img('hergrad2025.jpg'),
  },
  {
    id: 13,
    year: 'June 2025',
    title: 'Blissfully Unaware',
    description:
      '[Saron] I genuinely thought I was the mastermind. I had flawlessly planned his annual birthday trip to Puerto Rico. I was literally joking around the day before, pretending to have a ring on my finger, completely clueless that my life was about to change forever.',
    image: img('PR1.JPG'),
  },
  {
    id: 14,
    year: 'June 2025',
    title: 'The Master Plan',
    description:
      '[Yoni] This was Saturday night \u2014 just a good evening with friends and family, nobody suspicious. What she didn\u2019t know was that back home, everything was already in motion. The elders were set to visit her parents the next afternoon. By Sunday night, the question would be asked. She had absolutely no idea.',
    image: img('pr2.JPG'),
  },
  {
    id: 15,
    year: 'June 2025',
    title: 'The Blessing Before the Ring',
    description:
      '[Yoni] In Ethiopian tradition, before a man proposes, elders go to the family first \u2014 on his behalf \u2014 to ask for their daughter\u2019s hand and receive their blessing. Before I could do anything, her family had to say yes. While she and I were in Puerto Rico, that was happening back home. I just had to wait. One text came through. It said \u201cGo.\u201d And I went.',
    image: img('elders.jpeg'),
  },
  {
    id: 16,
    year: 'June 2025',
    title: 'The Ultimate Surprise',
    description:
      "[Saron] It was the best birthday trip ever\u2014and it wasn\u2019t even mine. Dropping to one knee took my breath away. But the moment I realized our friends had secretly flown in to pop out and celebrate the \u2018yes\u2019 with us? It was the most beautiful surprise of my life.",
    image: img('pr3.JPG'),
    callout: '↑ More photos from the proposal at the top of the page',
  },
  {
    id: 17,
    year: 'July 2025',
    title: 'Bringing It Home',
    description:
      '[Yoni] We brought that overwhelming joy back home to Pennsylvania. Celebrating at our engagement party, surrounded by the incredible community who prayed with us and for us, made the reality of our promise feel incredibly sweet. We were really doing this.',
    image: img('engagagmentparty.JPG'),
  },
  {
    id: 18,
    year: 'Aug 2025',
    title: 'Closing the Chapter',
    description:
      '[Yoni] We capped off the wildest summer of our lives by celebrating my grad school graduation. We conquered school, survived the long distance, and secured the ring. After this, I started my career, and Kuku went on to begin her own grad school journey as we finally prepared for marriage.',
    image: img('mygraduation2025.JPG'),
  },
];
