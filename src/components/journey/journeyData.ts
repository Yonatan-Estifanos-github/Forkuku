export interface JourneyItem {
  id: number;
  year: string;
  title: string;
  description: string;
  image?: string;
  callout?: string;
  amYear?: string;
  amTitle?: string;
  amDescription?: string;
  amCallout?: string;
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
    amYear: '2021 መጀመሪያ ወራቶች',
    amTitle: 'የዙም ጸሎት እና የኢንስታግራም ክትትል',
    amDescription:
      '[Saron] የኮቪድ ዘመን ከቤት መዉጣት በመከልከሉ ምክንያት መንፈሳዊ ፕሮግራሞችም ወደ ዙም ሚቲንግ ተቀየሩ። ክፉዉ የኮቪድ ዘመንም እኔና ዮኒ በዙም የፀሎት ፕሮግራም ላይ የተገናኘንበትን መልካም እድልን ከፈተ። ሜሪላንድ እና ፔንሲልቫኒያ በየቤታችን ሆነን እየተካፈልን በሄድንና ቀናት በጨመሩ ቁጥር ከጉባዔዉ መካከል የአንድ ሰዉ የፀሎት ስታይል ልቤን እየሰረቀዉ መጣ። ለካስ በዚያም በኩል ተመሳሳይ ስሜት ተፈጥሮ ነበርና አንድ ቀን የኢንስታግራም ጓደኝነት ጥያቄ ደረሰኝ። ዮኒ ነበር። ሃሌሉያ!! ጓደኝነት ተጀመረ። ሀሪስበርግ ፔንሲልቫኒያ መመላለስ ኒዉ ኖርማል ሆነ። ለዚህ ቅርቡ ታይትል የጋብርኤል ጋርሲያ \'ፍቅር በኮሌራ ዘመን\' የሚለዉ ነዉ።',
    },  {
    id: 2,
    year: 'Late 2021',
    title: 'The Night It All Shifted',
    description:
      '[Yoni] Seeing her in person at The Gathering — a conference in DC brought together by multiple different ministries — I just remember that curly hair and thinking how beautiful she was. [Saron] Inspired by Jesus washing his disciples\u2019 feet, the conference ended with a foot-washing service. I hate feet, yet I somehow found myself washing Yoni\u2019s. That night shifted everything. We texted endlessly — pausing at times to find clarity — leading to a December day where we finally confessed how we felt.',
    image: img('firsttime tellign each other w elike eachother2021.jpg'),
    amYear: 'መጨረሻ 2021',
    amTitle: 'ታሪክን የቀየረች ምሽት',
    amDescription:
      '[Yoni] \'The Gathering\' በተሰኘዉና በዲሲ የተለያዩ አገልግሎቶችን አካቶ በተካሄደዉ ኮንፈረንስ ላይ ፀጉሯን በተንጨባረረ ስታይል ተሰርታ ሳሮንን በአካል ሳያት ዉበቷ እንዴት በንዝረት እንደሳበኝ እና አሁንም በተያየን ቁጥር ያ ስሜት እንደ አዲስ መኖሩ ይደንቀኛል። [Saron] \'The Gathering\' የተሰኘዉ የዲሲ ኮንፈረንስ የተጠናቀቀዉ ዮሀንስ 13፡5 ላይ እየሱስ “የደቀ መዛሙርቱንም እግር ሊያጥብና በታጠቀበትም ማበሻ ጨርቅ ሊያብስ ጀመረ።” ተብሎ በተጻፈዉ መሰረት እርስ በእርስ እግር በመተጣጠብ ነበር። እንኳን እግር ማጠብን ይቅርና እግርን ራሱ የምጠላዋ ሴት በዚያች ምሽት የዮኒን እግር ሳጥብ ራሴን አገኘሁት። ታሪክ ተቀየረ። በዚያዉ ዓመት ታህሳስ ወር መዋደዳችንን በግልፅ እስከተነጋገርንበት ጊዜ ድረስ የስልክ ልዉዉጥ ጎረፈ። አንዳንዴ \'ለመፈታተሽ\' ልብ ከተሰቃቀልንባቸዉ ጥቂት ጊዜያት በስተቀር።',
  },
  {
    id: 3,
    year: 'Feb 2022',
    title: 'The Recon Mission',
    description:
      '[Saron] Feelings were one thing — actually driving out to Harrisburg to find out if any of this was real was another. So I did. It was. [Yoni] We didn\'t want to rush it. We started fasting and praying, took things slow, and before long we were quietly dating. We celebrated her birthday that month with a surprise — our first real moment together as something more.',
    image: img('herbirthday2022feb.jpeg'),
    amYear: 'የካቲት 2022',
    amTitle: 'ክትትሉ',
    amDescription:
      '[Saron] በስሜት የተጀመረ ፍቅር በተግባር ካልተረጋገጠ አደጋዉ ያመዝናል። ሂደቱ ግን ቀላል አልነበረም። በተደጋጋሚ ወደ ሀሪስበርግ መንዳትን አንዳንዴም በምሽት ዋጋን ያስከፈለ ነበር። [Yoni] መቸኮል አልፈለግንም። ጾም ፀሎት ጀመርን:: ኳስ በመሬት። ቀስ በቀስ የፍቅር ቀጠሮ (dating) ድምፅ አጥፍተን ጀመርን። በዚያዉ ወር የሳሮንን ልደት በድንገተኛ ስጦታ (surprise) አከበርን:: እንደ ፍቅረኛሞች አብረን ያሳለፍነው የመጀመሪያው እውነተኛ ጊዜ (dating) ነበር።',
  },
  {
    id: 4,
    year: 'Early 2022',
    title: 'Eight Hours & A Pause',
    description:
      '[Yoni] We went on an epic eight-hour hiking date, and the conversation just never ran dry. But despite the undeniable bond, we were both carrying unfinished business in our own lives. We stepped back — not with a plan, but with an open hand. If God brought us back together, great. If not, then maybe this was it. It turned out to be a year.',
    image: img('hike_bothofus2022.jpg'),
    amYear: 'መጀመሪያ 2022',
    amTitle: 'ስምንት ሰዓታት እና እረፍት',
    amDescription:
      '[Yoni] አስደናቂ የሆነ የስምንት ሰዓት የእግር ጉዞ (hiking) አደረግን፣ እናም ጨዋታችን ፈጽሞ አላቋረጠም ነበር። ምንም እንኳን የማይካድ ትስስር ቢኖረንም፣ ሁለታችንም በየራሳችን ህይወት ያልጨረስናቸው ጉዳዮች ነበሩን። ወደ ኋላ አፈገፈግን — በእቅድ ሳይሆን፣ ነገሮችን ክፍት አድርገን በመተው። እግዚአብሔር መልሶ ካገናኘን፣ ጥሩ ነው። ካልሆነ፣ ምናልባት መጨረሻችን ይሄው ነበር። ይህ ጊዜ ግን የአንድ ዓመት ቆይታ ሆኖ ተገኘ።',
  },
  {
    id: 5,
    year: 'May 2023',
    title: 'There She Was',
    description:
      '[Yoni] That year of silence wasn\u2019t easy, but it allowed the Lord to do a profound work in our hearts. When I looked out at my Penn State graduation and saw her sitting there — invited by my family — it hit me like a ton of bricks. The wait was over. I was finally ready.',
    image: img('2023mygrad.jpg'),
    amYear: 'ግንቦት 2023',
    amTitle: 'እዚያ ነበረች',
    amDescription:
      '[Yoni] ያ የዝምታ ዓመት ቀላል አልነበረም፣ ነገር ግን ጌታ በልባችን ውስጥ ጥልቅ ስራ እንዲሰራ ፈቅዶለታል። በፔን ስቴት ዩኒቨርሲቲ ምረቃዬ ላይ ተመልክቼ — በቤተሰቤ ተጋብዛ — እዚያ ተቀምጣ ሳያት፣ በጣም ደነገጥኩ። ጥበቃው አብቅቶ ነበር። በመጨረሻም ዝግጁ ነበርኩ።',
  },
  {
    id: 6,
    year: 'Summer 2023',
    title: "Abel & Hermela's Wedding",
    description:
      "[Saron] Before we even started dating, Hermella was the one who told me, \u2018Just go talk to him.\u2019 So standing by her side at her wedding, with Yoni right across the aisle as a groomsman, felt incredibly surreal. It was a hilarious, beautiful sneak peek at the future God was writing for us. [Yoni] I called Abel and begged him to get me paired to walk with her \u2014 lol thanks big dawg, I appreciate you for that.",
    image: img('abelandhermellawedding.jpg'),
    amYear: 'በጋ 2023',
    amTitle: 'የአቤል እና ሄርሜላ ሰርግ',
    amDescription:
      '[Saron] የፍቅር ግንኙነት ከመጀመራችን በፊት፣ ሄርሜላ \'ሂጂና አናግሪው\' ያለችኝ እሷ ነበረች። ስለዚህ በሰርጓ ላይ ከጎኗ ቆሜ፣ ዮኒን በሚዜነት ማዶ ማየቴ፣ በጣም አስደናቂ ስሜት ነበር። እግዚአብሔር ለእኛ እየጻፈው ላለው የወደፊት ህይወት አስቂኝ እና ውብ ቅምሻ ነበር። [Yoni] አቤልን ደውዬ ከእሷ ጋር እንድገባ እንዲያጣምረኝ ለመንኩት — ሃሃሃ እናመሰግናለን ወንድሜ፣ ለዚህ ውለታህ ከልብ አደንቅሃለሁ።',
  },
  {
    id: 7,
    year: 'Aug 5, 2023',
    title: 'The Vow Before The Vows',
    description:
      '[Yoni] I wasn\u2019t going to let her go again. In Philly, with her mother\u2019s blessing, sitting on the grass in front of the park \u2014 the LOVE sign was just for the photo \u2014 I told her that if we did this, we were doing it intentionally and walking straight toward forever. And for the first time, I told her I loved her. I had made a promise to myself that those words were only for my future wife. She was the first to hear them.',
    image: img('askingheroutPhilly.jpg'),
    amYear: 'ነሐሴ 5፣ 2023',
    amTitle: 'ከዋናው ቃል ኪዳን በፊት የነበረው ቃል ኪዳን',
    amDescription:
      '[Yoni] ዳግመኛ እንድትርቀኝ ልፈቅድ አልነበረም። በፊላዴልፊያ፣ በእናቷ በረከት፣ ከፓርኩ ፊት ለፊት ባለው ሳር ላይ ተቀምጠን — የ LOVE ምልክቱ ለፎቶው ብቻ ነበር — ይህን የምናደርገው ከሆነ፣ አውቀንበት እና ቀጥታ ወደ ዘለዓለማዊ ህይወት እየተጓዝን እንደሆነ ነገርኳት። እና ለመጀመሪያ ጊዜ፣ እንደምወዳት ነገርኳት። እነዚያን ቃላት ለወደፊት ሚስቴ ብቻ እንድናገር ለራሴ ቃል ገብቼ ነበር። እሷ የመጀመሪያዋ ሰሚ ነበረች።',
  },
  {
    id: 8,
    year: '2024',
    title: 'Surviving School',
    description:
      '[Yoni] With the foundation finally set, 2024 became a beautiful blur. I was deep into grad school, and she was finishing undergrad. [Saron] We kept our sanity by just doing life together. There was pure joy in simply surviving school side-by-side, knowing exactly who we were coming home to.',
    image: img('2024livignlife.JPG'),
    amYear: '2024',
    amTitle: 'ትምህርትን ማለፍ',
    amDescription:
      '[Yoni] በመጨረሻም መሰረቱ ከተጣለ በኋላ፣ 2024 ውብ የሆነ የሩጫ ጊዜ ሆነ። እኔ በድህረ ምረቃ ትምህርት ውስጥ ጠልቄ ነበርኩ፣ እሷ ደግሞ የመጀመሪያ ዲግሪዋን እየጨረሰች ነበር። [Saron] ጤናማ አእምሯችንን የጠበቅነው ህይወትን አብረን በማሳለፍ ነበር። የትምህርት ጊዜያችንን ጎን ለጎን እያለፍን፣ ወደ ማን እንደምንመለስ በእርግጠኝነት ማወቁ ንጹህ ደስታ ነበረው።',
  },
  {
    id: 9,
    year: '2024',
    title: 'Museum Escapes',
    description:
      '[Yoni] Between intense study sessions and planning for the future, we had to fiercely protect our time. Exploring museums became our sanctuary. These quiet dates were our favorite way to unplug, stop talking about exams, and just be completely present with each other.',
    image: img('lotsofmuseumdates24.JPEG'),
    amYear: '2024',
    amTitle: 'የሙዚየም ጉብኝቶች',
    amDescription:
      '[Yoni] በከባድ የጥናት ጊዜያት እና ለወደፊት በማቀድ መካከል፣ ጊዜያችንን በጥብቅ መጠበቅ ነበረብን። ሙዚየሞችን መጎብኘት መሸሸጊያችን ሆነ። እነዚህ ጸጥ ያሉ የፍቅር ቀጠሮዎች፣ ከጭንቀት ለመውጣት፣ ስለ ፈተናዎች ማውራት ለማቆም እና ሙሉ በሙሉ እርስ በርስ ለመገኛኘት ተወዳጅ መንገዳችን ነበሩ።',
  },
  {
    id: 10,
    year: '2024',
    title: 'Catching Our Breath',
    description:
      '[Saron] Sometimes the weight of school meant we just needed to walk in the woods for a few hours. Those simple afternoon hikes became essential moments of rest. No matter how crazy our schedules got, we always found our way back to the quiet trails where our story first blossomed.',
    image: img('2024morehiking.jpg'),
    amYear: '2024',
    amTitle: 'ትንፋሽ መውሰድ',
    amDescription:
      '[Saron] አንዳንድ ጊዜ የትምህርት ጫናው ለጥቂት ሰዓታት በጫካ ውስጥ መጓዝ እንድንፈልግ ያደርገን ነበር። እነዚያ ቀላል የከሰዓት በኋላ የእግር ጉዞዎች አስፈላጊ የእረፍት ጊዜያት ሆኑ። ፕሮግራማችን ምንም ያህል ቢበዛም፣ ሁልጊዜም ታሪካችን ለመጀመሪያ ጊዜ ወደ ፈካበት ጸጥ ወዳለው መንገድ እንመለስ ነበር።',
  },
  {
    id: 11,
    year: '2024',
    title: 'Perfect Practice',
    description:
      '[Yoni] It felt like the year of weddings. We spent so many weekends dressing up and celebrating the love of our friends. But every time we stood in those crowds together, it felt like the perfect practice. We were getting a glimpse of the day we would finally be standing at the front.',
    image: img('2024moreweddings.jpeg'),
    amYear: '2024',
    amTitle: 'ፍጹም ልምምድ',
    amDescription:
      '[Yoni] የሰርግ ዓመት ይመስል ነበር። በርካታ ቅዳሜና እሁዶችን ደምቀን በመልበስ የጓደኞቻችንን ፍቅር ስናከብር አሳለፍን። ነገር ግን በእነዚያ ታዳሚዎች መካከል አብረን ስንቆም፣ እንደ ፍጹም ልምምድ ይሰማን ነበር። በመጨረሻ ከፊት ለፊት የምንቆምበትን ቀን ቅምሻ እያገኘን ነበር።',
  },
  {
    id: 12,
    year: 'May 2025',
    title: 'Her Turn to Walk',
    description:
      "[Yoni] Watching her cross that stage was one of the proudest moments of my life. She worked incredibly hard for that degree \u2014 showing up every single day with grace and determination. This was her moment, fully earned, and I couldn\u2019t have been more proud to be in that crowd cheering her on.",
    image: img('hergrad2025.jpg'),
    amYear: 'ግንቦት 2025',
    amTitle: 'የእሷ ተራ',
    amDescription:
      '[Yoni] መድረኩን ስታቋርጥ ማየት በህይወቴ ካሉት በጣም የሚያኮሩ ጊዜያት አንዱ ነበር። ለዚያ ዲግሪ በጣም ጠንክራ ሰርታለች — በየቀኑ በጸጋ እና በቁርጠኝነት ትታይ ነበር። ይህ የእሷ ጊዜ ነበር፣ ሙሉ በሙሉ ያገኘችው፣ እና በእነዚያ ታዳሚዎች መካከል ሆኜ እሷን በማበረታታቴ ከዚህ በላይ ልኮራ አልችልም ነበር።',
  },
  {
    id: 13,
    year: 'June 2025',
    title: 'Blissfully Unaware',
    description:
      '[Saron] I genuinely thought I was the mastermind. I had flawlessly planned his annual birthday trip to Puerto Rico. I was literally joking around the day before, pretending to have a ring on my finger, completely clueless that my life was about to change forever.',
    image: img('PR1.JPG'),
    amYear: 'ሰኔ 2025',
    amTitle: 'በደስታ የተዋጠች እና ምንም ያላወቀች',
    amDescription:
      '[Saron] እኔ ሁሉንም ነገር ያቀድኩት እኔ እንደሆንኩ አስብ ነበር። የልደት ቀኑን ምክንያት በማድረግ ወደ ፖርቶ ሪኮ የሚደረገውን ዓመታዊ ጉዞ ያለምንም እንከን አቅጄ ነበር። ህይወቴ ለዘለዓለም ሊለወጥ እንደሆነ ምንም ሳላውቅ፣ አንድ ቀን ቀደም ብሎ ጣቴ ላይ ቀለበት እንዳለኝ በማስመሰል እቀልድ ነበር።',
  },
  {
    id: 14,
    year: 'June 2025',
    title: 'She Had No Idea',
    description:
      '[Yoni] This was Saturday night \u2014 just a good evening with friends and family, nobody suspicious. What she didn\u2019t know was that back home, everything was already in motion. The elders were set to visit her parents the next afternoon. By Sunday night, the question would be asked. She had absolutely no idea.',
    image: img('pr2.JPG'),
    amYear: 'ሰኔ 2025',
    amTitle: 'ምንም አታውቅም ነበር',
    amDescription:
      '[Yoni] ይህ የቅዳሜ ምሽት ነበር — ከጓደኞች እና ቤተሰብ ጋር ጥሩ ምሽት፣ ማንም የተጠራጠረ አልነበረም። እሷ ያላወቀችው ነገር ቢኖር፣ እቤት ውስጥ፣ ሁሉም ነገር አስቀድሞ እየተንቀሳቀሰ መሆኑን ነው። በማግስቱ ከሰዓት በኋላ ሽማግሌዎች ወላጆቿን ሊጎበኙ ተዘጋጅተው ነበር። በእሁድ ምሽት፣ ጥያቄው ይጠየቃል። እሷ ምንም አታውቅም ነበር።',
  },
  {
    id: 15,
    year: 'June 2025',
    title: 'The Blessing Before the Ring',
    description:
      '[Yoni] In Ethiopian tradition, before a man proposes, elders go to the family first \u2014 on his behalf \u2014 to ask for their daughter\u2019s hand and receive their blessing. Before I could do anything, her family had to say yes. While she and I were in Puerto Rico, that was happening back home. I just had to wait. One text came through. It said \u201cGo.\u201d And I went.',
    image: img('elders.jpeg'),
    amYear: 'ሰኔ 2025',
    amTitle: 'ከቀለበቱ በፊት በረከቱ',
    amDescription:
      '[Yoni] በኢትዮጵያውያን ባህል፣ አንድ ወንድ የጋብቻ ጥያቄ ከማቅረቡ በፊት፣ ሽማግሌዎች የልጃቸውን እጅ ለመጠየቅ እና በረከታቸውን ለመቀበል — በእሱ ስም — መጀመሪያ ወደ ቤተሰብ ይሄዳሉ። ምንም ከማድረጌ በፊት፣ ቤተሰቦቿ እሺ ማለት ነበረባቸው። እኔ እና እሷ በፖርቶ ሪኮ እያለን፣ ያ እቤት ውስጥ እየተከናወነ ነበር። መጠበቅ ብቻ ነበረብኝ። አንድ የጽሁፍ መልእክት መጣ። "ሂድ" ይላል። እናም ሄድኩ።',
  },
  {
    id: 16,
    year: 'June 2025',
    title: 'The Ultimate Surprise',
    description:
      "[Saron] It was the best birthday trip ever\u2014and it wasn\u2019t even mine. Dropping to one knee took my breath away. But the moment I realized our friends had secretly flown in to pop out and celebrate the \u2018yes\u2019 with us? It was the most beautiful surprise of my life.",
    image: img('pr3.JPG'),
    callout: '↑ More photos from the proposal at the top of the page',
    amYear: 'ሰኔ 2025',
    amTitle: 'ትልቁ ድንገተኛ ስጦታ',
    amDescription:
      "[Saron] ከሁሉም የተሻለው የልደት ጉዞ ነበር — የእኔ እንኳን ባልሆነበት። ተንበርክኮ ሲጠይቀኝ እስትንፋሴን አቋረጠው። ነገር ግን ጓደኞቻችን 'እሺ' በማለቴ አብረውን ለማክበር በድብቅ በረራ አድርገው መምጣታቸውን ሳውቅ? በህይወቴ ውስጥ በጣም ውብ የሆነው ድንገተኛ ስጦታ ነበር።",
    amCallout: '↑ ተጨማሪ የጋብቻ ጥያቄው ፎቶዎች ከገጹ አናት ላይ ይገኛሉ',
  },
  {
    id: 17,
    year: 'July 2025',
    title: 'Bringing It Home',
    description:
      '[Yoni] We brought that overwhelming joy back home to Pennsylvania. Celebrating at our engagement party, surrounded by the incredible community who prayed with us and for us, made the reality of our promise feel incredibly sweet. We were really doing this.',
    image: img('engagagmentparty.JPG'),
    amYear: 'ሀምሌ 2025',
    amTitle: 'ወደ ቤት ማምጣት',
    amDescription:
      '[Yoni] ያንን ታላቅ ደስታ ወደ ፔንሲልቬንያ ይዘን ተመለስን። አብረውን እና ስለ እኛ በጸለዩልን አስደናቂ ማህበረሰብ ተከበን፣ የቃል ኪዳናችን እውነታ በሚያስደንቅ ሁኔታ ጣፋጭ ሆኖ እንዲሰማን አድርጎታል፤ በእጮኝነት ግብዣችን ላይ ማክበራችንን ማለቴ ነው። በእርግጥም ይህን እያደረግነው ነበር።',
  },
  {
    id: 18,
    year: 'Aug 2025',
    title: 'Closing the Chapter',
    description:
      '[Yoni] We capped off the wildest summer of our lives by celebrating my grad school graduation. We conquered school, survived the long distance, and secured the ring. After this, I started my career, and Kuku went on to begin her own grad school journey as we finally prepared for marriage.',
    image: img('mygraduation2025.JPG'),
    amYear: 'ነሐሴ 2025',
    amTitle: 'ምዕራፉን መዝጋት',
    amDescription:
      '[Yoni] የድህረ ምረቃ ትምህርቴን ምረቃ በማክበር በህይወታችን ውስጥ በጣም አስደሳች የሆነውን በጋ አጠናቀቅን። ትምህርትን አሸነፍን፣ ርቀትን ተቋቋምን፣ እና ቀለበቱን አረጋገጥን። ከዚህ በኋላ፣ እኔ ስራዬን ጀመርኩ፣ ኩኩ ደግሞ የራሷን የድህረ ምረቃ ትምህርት ጉዞ ጀመረች፤ በመጨረሻም ለትዳር ዝግጅት ጀመርን።',
  },
];
