import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/** Full Our Story article + Brand Promise sidebar — shared by Home (teaser CTA) and About page. */
export function OurStoryCard() {
  return (
    <Card className="overflow-hidden rounded-3xl border border-[#E6A817]/20 bg-[#2B1D0E] text-[#F5E9D7]">
      <CardContent className="flex flex-col gap-8 p-5 md:gap-10 md:p-10 lg:flex-row lg:items-start lg:gap-12 lg:p-12">
        <div lang="hi" className="min-w-0 flex-1 space-y-5 font-devanagari">
          <div>
            <Badge className="border-0 bg-[#E6A817] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-[#2B1D0E] md:text-xs">
              Our Story
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-[#F5E9D7] md:text-3xl lg:text-[2rem]">
              लोकेश गजाम ने मधुमक्खी पालन से खड़ी की सफलता की मिसाल
            </h2>
            <p className="mt-3 border-l-2 border-[#E6A817]/70 pl-3 text-base font-medium leading-relaxed text-[#E6A817] md:text-lg">
              इंजीनियरिंग के बाद &apos;जुगराज संस हाइव&apos; के माध्यम से शुद्ध शहद और जैविक खेती को दे रहे बढ़ावा
            </p>
          </div>

          <p className="text-[15px] leading-[1.75] text-[#F5E9D7]/88 md:text-base">
            <span className="font-semibold text-[#F5E9D7]">बालाघाट/चंद्रपुर:</span> आज के दौर में जहाँ युवा इंजीनियरिंग की डिग्री के बाद बड़े शहरों में नौकरी की तलाश करते हैं, वहीं लोकेश गजाम ने स्वरोजगार और किसानों के उत्थान की एक नई मिसाल पेश की है। RGPV यूनिवर्सिटी, भोपाल से साल 2016 में B.E. (Mechanical) की पढ़ाई पूरी करने के बाद लोकेश ने मशीनों की दुनिया छोड़कर प्रकृति के साथ जुड़कर &apos;मौन पालन&apos; (Bee Farming) को अपना करियर चुना।
          </p>

          <div className="space-y-3 pt-1">
            <h3 className="text-lg font-semibold text-[#E6A817] md:text-xl">सीखने का जुनून और संघर्ष भरा सफर</h3>
            <p className="text-[15px] leading-[1.75] text-[#F5E9D7]/85 md:text-base">
              लोकेश की मधुमक्खी पालन में शुरू से ही गहरी रुचि थी। इसे पेशेवर तरीके से सीखने के लिए उन्होंने महाराष्ट्र, हरियाणा और उत्तर प्रदेश के अनुभवी किसानों के खेतों का दौरा किया। उन्होंने महाराष्ट्र के चंद्रपुर जिले के प्रसिद्ध प्रगतिशील किसान रवींद्र जोड़ी से मधुमक्खी पालन की बारीकियां सीखीं।
            </p>
            <p className="text-[15px] leading-[1.75] text-[#F5E9D7]/85 md:text-base">
              साल 2023 में उन्होंने मात्र 5 बॉक्स और मधुमक्खियों की प्रजाति &apos;एपिस मेलिफेरा&apos; (Apis mellifera) के साथ अपने काम की शुरुआत की। शुरुआती सफर चुनौतियों भरा था; अनुभव की कमी के कारण 5 में से केवल 1 बॉक्स ही बचा। लेकिन लोकेश ने हार नहीं मानी और आज उनके पास 100 बॉक्स (50 एपिस मेलिफेरा और 50 एपिस सेराना इंडिका) का सफल सेटअप है।
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#E6A817] md:text-xl">उत्पादन क्षमता और तकनीकी दक्षता</h3>
            <p className="text-[15px] leading-relaxed text-[#F5E9D7]/80 md:text-base">
              लोकेश गजाम मधुमक्खी पालन की आर्थिक और तकनीकी क्षमता के बारे में बताते हैं:
            </p>
            <blockquote className="rounded-xl border border-[#E6A817]/25 bg-[#F5E9D7]/[0.07] px-4 py-3 text-[15px] italic leading-relaxed text-[#F5E9D7]/92 md:px-5 md:text-base">
              &ldquo;एक पूर्ण और स्वस्थ मधुमक्खी बॉक्स से एक हफ्ते में लगभग 2 से 3 किलो शुद्ध शहद प्राप्त होता है। सही देख-रेख और फूलों की पर्याप्त उपलब्धता के साथ यह उत्पादन निरंतर बना रहता है।&rdquo;
            </blockquote>
          </div>

          <div className="space-y-3 pb-1">
            <h3 className="text-lg font-semibold text-[#E6A817] md:text-xl">&apos;जुगराज संस हाइव&apos; (Jugraj Son&apos;s Hive) का लक्ष्य</h3>
            <p className="text-[15px] leading-[1.75] text-[#F5E9D7]/85 md:text-base">
              लोकेश का उद्देश्य केवल शहद बेचना नहीं, बल्कि लोगों को मिलावट रहित उत्पाद देना है। वे कहते हैं:
            </p>
            <blockquote className="rounded-xl border border-[#E6A817]/25 bg-[#F5E9D7]/[0.07] px-4 py-3 text-[15px] italic leading-relaxed text-[#F5E9D7]/92 md:px-5 md:text-base">
              &ldquo;हम &apos;जुगराज संस हाइव&apos; ब्रांड के माध्यम से लोगों तक सीधे फार्म से निकाला गया 100% शुद्ध शहद पहुँचा रहे हैं। साथ ही, हम अपने बॉक्स उन किसानों के खेतों में रखते हैं जो जैविक खेती (Organic Farming) करते हैं। इससे मधुमक्खियों द्वारा होने वाले परागण (Pollination) से किसानों की फसलों की पैदावार भी बढ़ रही है।&rdquo;
            </blockquote>
            <p className="text-[15px] leading-[1.75] text-[#F5E9D7]/88 md:text-base">
              एक मैकेनिकल इंजीनियर से एक सफल उद्यमी बनने का लोकेश गजाम का यह सफर आज के युवाओं और किसानों के लिए प्रेरणा का केंद्र है।
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-2xl bg-[#F5E9D7]/10 p-5 md:p-6 lg:sticky lg:top-24 lg:max-w-[22rem] lg:self-start">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-[#E6A817]">Brand Promise</p>
          <p className="mt-3 font-devanagari text-lg font-medium leading-relaxed text-[#F5E9D7] md:text-xl" lang="hi">
            हम शहद बेचते नहीं, विश्वास बांटते हैं। चख कर देखिए, आपको शुद्धता खुद बताएगी अपनी कहानी।
          </p>
          <div className="mt-6 space-y-3 font-devanagari text-sm leading-snug text-[#F5E9D7]/85 md:text-[15px]" lang="hi">
            <p className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E6A817]" />
              <span>फार्म से सीधा, मिलावट रहित शुद्ध शहद</span>
            </p>
            <p className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E6A817]" />
              <span>जैविक खेतों में बॉक्स — परागण से फसलों को लाभ</span>
            </p>
            <p className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E6A817]" />
              <span>गुणवत्ता जाँच के बाद ही आप तक पहुँच</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
