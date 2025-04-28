export type Candidate = {
  id: string
  name: string
  category: string
  votes: number
  photo?: string
  biography?: string
}

export const categories = [
  "Media",
  "Social Media Influence",
  "Politics & Governance",
  "Human Rights & Social Justice",
  "Corporate",
  "Healthcare",
  "Education, Training & Development",
  "Youth & Innovation",
  "Gender Equality",
  "Money & Business",
  "Manufacturing & Industrialization",
  "Hospitality & Tourism",
  "Agriculture & Climate Change",
  "Sports",
  "Tech and Entrepreneurship",
  "Real Estate & Development",
  "People With Disability & Minority",
  "Entertainment & Creative Arts",
  "Diaspora Impact",
  "Lifetime Achievement",
]

export const initialCandidates: Candidate[] = [
  // Media
  {
    id: "1",
    name: "Lynne Ngugi",
    category: "Media",
    votes: 0,
    photo: "/images/lynne-ngugi-new.jpeg",
    biography:
      "Lynn Ngugi is a renowned Kenyan journalist, media personality, and digital content creator. Recognized as one of the BBC's 100 Most Inspiring Women, she is also a Commonwealth Change Ambassador and a passionate advocate for social justice. As the CEO of Lynn Ngugi Network, she leads one of Kenya's most influential YouTube platforms, using storytelling to amplify voices, spark conversations, and drive change.",
  },
  {
    id: "2",
    name: "Yvonne Okwara",
    category: "Media",
    votes: 0,
    photo: "/images/yvonne-okwara-portrait.jpeg",
    biography:
      "Yvonne Okwara is a seasoned Kenyan television journalist with 13 years of experience in radio and television broadcasting. She currently works as a Business Editor at Citizen TV and is also a Bloomberg ALI Media Fellow.",
  },
  {
    id: "3",
    name: "Mashirima Kapombe",
    category: "Media",
    votes: 0,
    photo: "/images/mashirima-kapombe-new.jpg",
    biography:
      "Mashirima Kapombe is an award-winning journalist and a bilingual news anchor and reporter with a passion for Kiswahili. She currently works at Royal Media Services, delivering Swahili news and specializing in human interest stories and anchoring.",
  },
  {
    id: "4",
    name: "Adelle Onyango",
    category: "Media",
    votes: 0,
    photo: "/images/adele-onyango-new.jpeg",
    biography:
      "Adelle Onyango is a prominent Kenyan media personality and the founder of Legally Clueless Africa and The Adelle Onyango Initiative. She is internationally recognized for her advocacy for African women and youth empowerment. Her achievements include being named one of Facebook's 2019 Icons of Change, one of Africa Youth Awards' 100 Most Influential Young Africans in 2019, one of OkayAfrica's 100 Extraordinary African Women in 2018, and one of BBC's 100 Inspirational and Innovative Women in 2017. With over a decade of experience in the radio industry, Adelle leads The Adelle Onyango Initiative (AOI), which develops programs to equip Kenyan youth with skills for employment or entrepreneurship and provides psychosocial support for African women who have survived rape.",
  },
  {
    id: "5",
    name: "Pamela Sittoni",
    category: "Media",
    votes: 0,
    photo: "/images/pamela-sittoni-new.jpg",
    biography:
      "Pamella Makotsi-Sittoni is a Kenyan journalist and author who currently serves as the Executive Editor and Managing Editor of the Daily Nation at Nation Media Group. Appointed to this role in 2019, she made history as the first woman to hold this position at the publishing house.",
  },
  {
    id: "6",
    name: "Zubeida Koome",
    category: "Media",
    votes: 0,
    photo: "/images/zubeida-koome-new.jpg",
    biography:
      "Zubeidah Kananu Koome is a Kenyan anchor, presenter, mentor, and moderator. She currently works as a Swahili presenter and reporter for KTN, where she also serves as the political editor. Notably, Zubeidah is the first woman to hold the position of President of the Kenya Editors Guild (KEG).",
  },
  {
    id: "7",
    name: "Victoria Rubadiri",
    category: "Media",
    votes: 0,
    photo: "/images/victoria-rubadiri-new.jpg",
    biography:
      "Victoria Rubadiri is a Kenyan journalist and television anchor with CNN International in Kenya. In 2020, she was honored with the BBC World News Komla Dumor Award. She holds a bachelor's degree in Broadcast Journalism from Temple University in Philadelphia, Pennsylvania, which she earned in 2009. Rubadiri also serves as a CNN correspondent and moderator.",
  },
  {
    id: "8",
    name: "Mwende Macharia",
    category: "Media",
    votes: 0,
    photo: "/images/mwende-macharia-new.jpg",
    biography:
      "Esther Mwende Macharia is one of Kenya's leading media personalities, known for her work across television, radio, and digital platforms. She is the host of The Queen's Podcast, a sought-after MC, influencer, and media trainer. Mwende is the founder of EMM Online TV and Mwende's Protégé, a mentorship program designed to empower young professionals. She also leads the Champs Foundation, an initiative dedicated to promoting self-empowerment and personal development among the youth through life skills training.",
  },

  // Social Media Influence
  {
    id: "9",
    name: "Ajib Gathoni",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/ajib-gathoni.jpeg",
  },
  {
    id: "10",
    name: "Diana Marua",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/diana-marua.jpeg",
  },
  {
    id: "11",
    name: "Eve Mungai",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/eve-mungai.jpeg",
  },
  {
    id: "12",
    name: "Esther Akoth (Akothee)",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/esther-akoth-new.jpeg",
    biography:
      'Esther Akoth, popularly known as Akothee, is a celebrated Kenyan musician, entrepreneur, and philanthropist. She is the founder of Akothee Safaris, a leading tour company, the Akothee Foundation, a charity dedicated to uplifting vulnerable communities, and Aknotela and Akothee Homes, her ventures in the real estate sector. A multiple award-winning artist, she has earned accolades such as "Best Female Artist (East Africa)" at the African Muzik Magazine Awards (2016, 2019), "Best Video" at the same awards in 2016, and "Best Female Artist" at the African Entertainment Awards USA.',
  },
  {
    id: "13",
    name: "Debby Rono",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/debby-ronoh.jpeg",
  },
  {
    id: "14",
    name: "Hanifa Farsafi",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/hanifa-farsafi.jpeg",
  },
  {
    id: "15",
    name: "Miss Muthoni",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/muthoni-njoroge.jpg",
    biography:
      "Ms. Muthoni Njoroge is a prominent Kenyan social media influencer known for her engaging content and strong online presence. With a growing following across multiple platforms, she uses her influence to promote positive social change and empower young Kenyans.",
  },
  {
    id: "101",
    name: "Bushra Sakshi",
    category: "Social Media Influence",
    votes: 0,
    photo: "/images/bushra-sakshi.jpeg",
  },

  // Politics & Governance
  {
    id: "16",
    name: "Anne Waiguru",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/anne-waiguru.jpeg",
  },
  {
    id: "17",
    name: "Fatuma Achani",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/fatuma-achani.jpeg",
  },
  {
    id: "18",
    name: "Gladys Wanga",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/gladys-wanga.jpeg",
  },
  {
    id: "19",
    name: "Margaret Nyakango",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/margaret-nyakango.jpg",
    biography:
      "Margaret Nyakang'o is the Controller of Budget of Kenya, a constitutional office responsible for overseeing the implementation of budgets of the national and county governments. With extensive experience in finance and public administration, she plays a crucial role in ensuring fiscal responsibility and transparency in government spending.",
  },
  {
    id: "20",
    name: "Gathoni wa Muchomba",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/gathoni-wa-muchomba.jpeg",
  },
  {
    id: "21",
    name: "Jane Njeri Maina",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/jane-njeri-maina.jpeg",
  },
  {
    id: "22",
    name: "Millie Odhiambo",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/millie-odhiambo.jpg",
    biography:
      "Millie Odhiambo is a prominent Kenyan politician and lawyer who serves as the Member of Parliament for Suba North Constituency. Known for her outspoken advocacy for women's and children's rights, she has been instrumental in pushing for legislative reforms to protect vulnerable groups in society. Her bold approach to politics and commitment to social justice has established her as one of Kenya's most recognizable female political leaders.",
  },
  {
    id: "23",
    name: "CJ Martha Koome",
    category: "Politics & Governance",
    votes: 0,
    photo: "/images/cj-martha-koome.jpeg",
  },

  // Human Rights & Social Justice
  {
    id: "24",
    name: "Gloria Orwoba",
    category: "Human Rights & Social Justice",
    votes: 0,
    photo: "/images/gloria-orwoba.jpeg",
  },
  {
    id: "25",
    name: "Nerima Wako Ojiwa",
    category: "Human Rights & Social Justice",
    votes: 0,
    photo: "/images/nerima-wako.jpg",
    biography:
      "Nerima Wako-Ojiwa is a political analyst, writer, and youth advocate who serves as the Executive Director of Siasa Place, an organization that promotes youth participation in politics and governance. Through her work, she has created platforms for young people to engage with political processes and policy development in Kenya. Her expertise in youth political engagement has made her a respected voice in discussions about Kenya's political landscape and future.",
  },
  {
    id: "26",
    name: "Faith Odhiambo",
    category: "Human Rights & Social Justice",
    votes: 0,
    photo: "/images/faith-odhiambo.jpeg",
  },
  {
    id: "27",
    name: "Njeri wa Migwi",
    category: "Human Rights & Social Justice",
    votes: 0,
    photo: "/images/njeri-wa-migwi.jpg",
    biography:
      "Njeri wa Migwi is a human rights defender and the co-founder of Usikimye, an organization that works to end gender-based violence in Kenya. Through her advocacy, she has created safe spaces for survivors of violence and implemented community-based interventions to address the root causes of gender-based violence. Her grassroots approach to activism has helped thousands of women and children escape abusive situations and rebuild their lives.",
  },
  { id: "28", name: "Mercy Odondo", category: "Human Rights & Social Justice", votes: 0 },

  // Corporate
  {
    id: "29",
    name: "Jane Karuku",
    category: "Corporate",
    votes: 0,
    photo: "/images/jane-karuku.png",
  },
  {
    id: "30",
    name: "Rita Kavashe",
    category: "Corporate",
    votes: 0,
  },
  {
    id: "31",
    name: "Laila Macharia",
    category: "Corporate",
    votes: 0,
    photo: "/images/laila-macharia.jpeg",
  },
  {
    id: "32",
    name: "Dorothy Ghettuba Pala",
    category: "Corporate",
    votes: 0,
    photo: "/images/dorothy-ghettuba.jpeg",
  },
  {
    id: "33",
    name: "Eva Muraya",
    category: "Corporate",
    votes: 0,
    photo: "/images/eva-muraya.png",
  },
  {
    id: "34",
    name: "Mary Mulili",
    category: "Corporate",
    votes: 0,
    photo: "/images/mary-mulili.jpeg",
    biography:
      "Mary Mulili is a corporate leader with extensive experience in business management and strategic leadership. Her expertise has contributed to the growth and success of various corporate entities in Kenya.",
  },
  { id: "35", name: "Joan the Career Coach", category: "Corporate", votes: 0 },
  {
    id: "36",
    name: "Lucia Musau",
    category: "Corporate",
    votes: 0,
    photo: "/images/lucia-musau.jpeg",
  },

  // Healthcare
  {
    id: "37",
    name: "Dr. Lizzie Itotia",
    category: "Healthcare",
    votes: 0,
    photo: "/images/dr-lizzie-itotia.jpeg",
  },
  {
    id: "38",
    name: "Anna Qabale Duba",
    category: "Healthcare",
    votes: 0,
    photo: "/images/anne-qabale-duba.jpeg",
  },
  {
    id: "39",
    name: "Stella Wairimu Bosire",
    category: "Healthcare",
    votes: 0,
    photo: "/images/stellah-wairimu-bosire.jpeg",
    biography:
      "Dr. Stella Wairimu Bosire is a medical doctor, public health specialist, and human rights advocate. She has dedicated her career to improving healthcare access for marginalized communities and advocating for the rights of vulnerable populations in Kenya.",
  },

  // Education, Training & Development
  {
    id: "40",
    name: "Mumbi Ndung'u",
    category: "Education, Training & Development",
    votes: 0,
    photo: "/images/mumbi-ndungu.jpeg",
    biography:
      "Mumbi Ndung'u is a dedicated educator and training specialist with extensive experience in developing educational programs that empower Kenyan youth. Her innovative approaches to learning have transformed educational outcomes in various institutions across the country.",
  },
  {
    id: "41",
    name: "Prof. Nancy Booker",
    category: "Education, Training & Development",
    votes: 0,
    photo: "/images/prof-nancy-booker.jpeg",
    biography:
      "Professor Nancy Booker is a distinguished academic and educational leader with expertise in media and communication studies. She has contributed significantly to higher education in Kenya, focusing on curriculum development and academic excellence.",
  },
  {
    id: "42",
    name: "Rosalia Mkanjala",
    category: "Education, Training & Development",
    votes: 0,
    photo: "/images/rosalia-mkanjala.jpeg",
    biography:
      "Rosalia Mkanjala is a passionate advocate for educational reform and access to quality education for all Kenyans. Her work has focused on improving educational standards and creating inclusive learning environments.",
  },
  {
    id: "43",
    name: "Wawira Njiru",
    category: "Education, Training & Development",
    votes: 0,
    photo: "/images/wawira-njiru.jpeg",
    biography:
      "Wawira Njiru is the founder and Executive Director of Food for Education, an organization that provides subsidized nutritious meals to primary school children in Kenya. Her innovative work has improved school attendance and performance for thousands of children across the country.",
  },
  {
    id: "44",
    name: "Nelly Cheboi",
    category: "Education, Training & Development",
    votes: 0,
    photo: "/images/nelly-cheboi.jpeg",
    biography:
      "Nelly Cheboi is a social entrepreneur and the founder of TechLit Africa, an organization that repurposes used computers to build computer labs in rural Kenyan schools. Her work has been recognized globally, including being named a CNN Hero for her contributions to digital literacy in Africa.",
  },

  // Youth & Innovation
  {
    id: "45",
    name: "Caren Wakoli",
    category: "Youth & Innovation",
    votes: 0,
    photo: "/images/caren-wakoli.jpeg",
  },
  {
    id: "46",
    name: "Nancy Maina",
    category: "Youth & Innovation",
    votes: 0,
    photo: "/images/nancy-maina.jpeg",
    biography:
      "Nancy Maina is an innovative young leader who has made significant contributions to youth empowerment and technological innovation in Kenya. Her creative approaches to solving social challenges have inspired many young Kenyans to pursue entrepreneurship and innovation.",
  },
  { id: "46", name: "Nancy Maina", category: "Youth & Innovation", votes: 0 },
  {
    id: "47",
    name: "Angela Oduor Lungati",
    category: "Youth & Innovation",
    votes: 0,
    photo: "/images/angela-oduor-lungati.jpeg",
  },
  {
    id: "48",
    name: "Esther Ndeti",
    category: "Youth & Innovation",
    votes: 0,
    photo: "/images/esther-ndeti.jpeg",
  },
  {
    id: "49",
    name: "Beth Koigi",
    category: "Youth & Innovation",
    votes: 0,
    photo: "/images/beth-koigi.jpeg",
  },
  { id: "50", name: "Sheryl Mboya", category: "Youth & Innovation", votes: 0 },

  // Gender Equality
  {
    id: "51",
    name: "Anne Ireri",
    category: "Gender Equality",
    votes: 0,
    photo: "/images/anne-ireri.jpeg",
  },
  { id: "52", name: "Dorcas Rigathi", category: "Gender Equality", votes: 0, photo: "/images/dorcas-rigathi.jpeg" },
  { id: "53", name: "PS Wangombe", category: "Gender Equality", votes: 0 },

  // Money & Business
  {
    id: "54",
    name: "Dr. Joyce Gikunda",
    category: "Money & Business",
    votes: 0,
    photo: "/images/dr-joyce-gikunda.jpeg",
  },
  { id: "55", name: "Mary Muthoni Jason", category: "Money & Business", votes: 0 },
  {
    id: "56",
    name: "Ann Mathu",
    category: "Money & Business",
    votes: 0,
    photo: "/images/ann-mathu.jpeg",
  },
  { id: "57", name: "Dr Susan Onyancha", category: "Money & Business", votes: 0 },
  {
    id: "58",
    name: "Just Ivy Africa",
    category: "Money & Business",
    votes: 0,
    photo: "/images/just-ivy-africa.png",
  },

  // Manufacturing & Industrialization
  {
    id: "59",
    name: "Flora Mutahi",
    category: "Manufacturing & Industrialization",
    votes: 0,
    photo: "/images/flora-mutahi.png",
  },
  {
    id: "60",
    name: "Caroline Kariuki",
    category: "Manufacturing & Industrialization",
    votes: 0,
    photo: "/images/caroline-kariuki.png",
  },
  { id: "61", name: "Mary Ngechu", category: "Manufacturing & Industrialization", votes: 0 },

  // Hospitality & Tourism
  { id: "62", name: "Sarah Kabu", category: "Hospitality & Tourism", votes: 0 },
  {
    id: "63",
    name: "Captain Ruth Karauri",
    category: "Hospitality & Tourism",
    votes: 0,
    photo: "/images/captain-ruth-karauri.png",
  },
  {
    id: "64",
    name: "Dr. Betty Adero Radier",
    category: "Hospitality & Tourism",
    votes: 0,
    photo: "/images/dr-betty-adero.png",
  },

  // Agriculture & Climate Change
  {
    id: "65",
    name: "Jamila Abbas",
    category: "Agriculture & Climate Change",
    votes: 0,
    photo: "/images/jamila-abbas.png",
  },
  {
    id: "66",
    name: "Judy Matu",
    category: "Agriculture & Climate Change",
    votes: 0,
    photo: "/images/dr-judy-matu.png",
  },
  {
    id: "67",
    name: "Daphne Muchai",
    category: "Agriculture & Climate Change",
    votes: 0,
    photo: "/images/daphine-muchai.png",
  },
  {
    id: "68",
    name: "Elizabeth Wanjiru Wathuti",
    category: "Agriculture & Climate Change",
    votes: 0,
    photo: "/images/elizabeth-wathuti.png",
  },

  // Sports
  {
    id: "69",
    name: "Faith Kipyegon",
    category: "Sports",
    votes: 0,
    photo: "/images/faith-kipyegon.png",
  },
  {
    id: "70",
    name: "Angela Okutoyi",
    category: "Sports",
    votes: 0,
    photo: "/images/angela-okutoyi.png",
  },
  { id: "71", name: "Mwanalima Adam Jereko", category: "Sports", votes: 0 },
  {
    id: "72",
    name: "Alexandra Ndolo",
    category: "Sports",
    votes: 0,
    photo: "/images/alexandra-ndolo.png",
  },
  { id: "73", name: "Paula Munyi", category: "Sports", votes: 0 },
  {
    id: "74",
    name: "Janet Wanja",
    category: "Sports",
    votes: 0,
    photo: "/images/janet-wanja.png",
  },
  { id: "75", name: "Slyvia Gathoni", category: "Sports", votes: 0 },
  {
    id: "76",
    name: "Lorna Abiero",
    category: "Sports",
    votes: 0,
    photo: "/images/lorna-abiero.png",
  },

  // Tech and Entrepreneurship
  {
    id: "77",
    name: "Dr. Chao Mbogho",
    category: "Tech and Entrepreneurship",
    votes: 0,
    photo: "/images/dr-chao-mbogho.png",
  },
  { id: "78", name: "Susan Odhiambo", category: "Tech and Entrepreneurship", votes: 0 },
  {
    id: "79",
    name: "Dorothy Ooko",
    category: "Tech and Entrepreneurship",
    votes: 0,
    photo: "/images/dorothy-ooko.png",
  },
  {
    id: "80",
    name: "Janet C. Kemboi",
    category: "Tech and Entrepreneurship",
    votes: 0,
    photo: "/images/janet-kemboi.png",
  },

  // Real Estate & Development
  {
    id: "81",
    name: "Leah Wambui",
    category: "Real Estate & Development",
    votes: 0,
    photo: "/images/leah-wambui.png",
  },
  {
    id: "82",
    name: "Liz Njuguna",
    category: "Real Estate & Development",
    votes: 0,
    photo: "/images/liz-njuguna.png",
  },
  { id: "83", name: "Robyn Emerson", category: "Real Estate & Development", votes: 0 },

  // People With Disability & Minority
  {
    id: "84",
    name: "Crystal Asige",
    category: "People With Disability & Minority",
    votes: 0,
    photo: "/images/crystal-asige.png",
  },
  {
    id: "85",
    name: "Naisula Lesuuda",
    category: "People With Disability & Minority",
    votes: 0,
    photo: "/images/naisula-lesuuda.png",
    biography:
      "Naisula Lesuuda is a Kenyan politician, journalist, and peace ambassador. She made history as the youngest woman to be nominated to the Kenyan Senate and later became the Member of Parliament for Samburu West Constituency. As a champion for marginalized communities, she has been instrumental in advocating for the rights of minority groups and promoting peace initiatives in conflict-prone areas.",
  },
  {
    id: "86",
    name: "Wanja Maina",
    category: "People With Disability & Minority",
    votes: 0,
    photo: "/images/wanja-maina.png",
    biography:
      "Wanja Maina is a passionate advocate for the rights of people with disabilities in Kenya. Through her work, she has championed inclusive policies and raised awareness about the challenges faced by marginalized communities. Her vibrant personality and dedication to creating a more equitable society have made her an influential voice in Kenya's disability rights movement.",
  },

  // Entertainment & Creative Arts
  {
    id: "87",
    name: "Nikita Kering",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/nikita-kering.png",
    biography:
      "Nikita Kering is a multi-award-winning Kenyan singer-songwriter who has been recognized as one of Africa's most promising musical talents. Despite her young age, she has already won multiple Afrima Awards and is known for her powerful vocals and emotional songwriting. Her music addresses important social issues while showcasing her exceptional vocal range and artistic maturity.",
  },
  {
    id: "89",
    name: "Nadia Mukami",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/nadia-mukami.png",
    biography:
      "Nadia Mukami is one of Kenya's leading female musicians known for her powerful vocals and hit songs that blend Afropop with R&B influences. As the founder of Sevens Creative Hub, she also works to nurture upcoming talent in the music industry. Her entrepreneurial spirit and artistic excellence have established her as both a successful performer and business leader in Kenya's entertainment sector.",
  },
  {
    id: "88",
    name: "Jacky Vike",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/jacky-vike.png",
  },
  {
    id: "90",
    name: "Catherine Kamau",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/catherine-kamau.png",
  },
  {
    id: "91",
    name: "Angela Ndambuki",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/angela-ndambuki.png",
  },
  {
    id: "92",
    name: "Sofiya Nzau",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/sofiya-nzau.png",
    biography:
      "Sofiya Nzau is a rising Kenyan musician who gained international recognition with her viral hit 'Mwaki.' Her unique blend of traditional Kenyan sounds with contemporary music has captivated audiences worldwide, making her one of Kenya's most exciting musical exports. Her distinctive style and artistic vision have established her as an important voice in the new generation of African artists.",
  },
  {
    id: "93",
    name: "Wixx Mangutha",
    category: "Entertainment & Creative Arts",
    votes: 0,
    photo: "/images/wixx-mangutha.png",
    biography:
      "Wixx Mangutha is a vibrant content creator, comedian, and social media personality who has captured the hearts of many Kenyans with her humorous skits and relatable content. Her authentic approach to storytelling and ability to address social issues through comedy has earned her a dedicated following across multiple platforms. She represents the new generation of digital entertainers shaping Kenya's creative landscape.",
  },

  // Diaspora Impact
  {
    id: "94",
    name: "Lupita Nyong'o",
    category: "Diaspora Impact",
    votes: 0,
    photo: "/images/lupita-nyongo.png",
  },
  {
    id: "95",
    name: "Lilian Seenoi-Barr",
    category: "Diaspora Impact",
    votes: 0,
    photo: "/images/lilian-seenoi-barr.png",
  },
  {
    id: "96",
    name: "Winfred Yavi",
    category: "Diaspora Impact",
    votes: 0,
    photo: "/images/winfred-yavi.png",
    biography:
      "Winfred Yavi is an accomplished athlete who has represented Bahrain in international competitions, including the Olympics and World Championships in the 3000m steeplechase. Born in Kenya, she has achieved remarkable success on the global stage, including winning medals at prestigious athletic events. Her athletic achievements have inspired many young women in both Kenya and Bahrain.",
  },

  // Lifetime Achievement
  {
    id: "97",
    name: "Eunice Mathu",
    category: "Lifetime Achievement",
    votes: 0,
    photo: "/images/eunice-mathu.png",
  },
  {
    id: "98",
    name: "Dr. Ida Odinga",
    category: "Lifetime Achievement",
    votes: 0,
    photo: "/images/ida-odinga.png",
  },
  {
    id: "99",
    name: "Hon. Martha Karua",
    category: "Lifetime Achievement",
    votes: 0,
    photo: "/images/martha-karua.png",
    biography:
      "Martha Karua is a veteran Kenyan politician, lawyer, and former Justice Minister known for her unwavering stance against corruption and advocacy for constitutional reforms. Often referred to as the 'Iron Lady' of Kenyan politics, she has been at the forefront of Kenya's democratic struggles and women's political participation for decades. Her principled leadership and commitment to justice have made her one of Kenya's most respected political figures.",
  },
  {
    id: "100",
    name: "Prof. Eddah Gachukia",
    category: "Lifetime Achievement",
    votes: 0,
    photo: "/images/prof-eddah-gachukia.png",
    biography:
      "Professor Eddah Gachukia is a pioneering Kenyan educator, women's rights advocate, and former Member of Parliament. She co-founded the Riara Group of Schools and has dedicated her life to advancing education and gender equality in Kenya. Her contributions to educational policy and women's empowerment have earned her numerous accolades and established her as one of Kenya's most respected educational leaders.",
  },
]
