import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavingsCalculator from "@/components/SavingsCalculator";
import SaasVsBuild from "@/components/SaasVsBuild";
import AutomationAuditor from "@/components/AutomationAuditor";

const ResourceHub = () => {
    return (
        <section id="resource-audit" className="py-20 bg-white border-y border-stone-200">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    <span className="font-mono text-sm tracking-wider text-muted-foreground uppercase mb-2 block">
                        Self-Service Tools
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900">
                        Run Your Own Numbers
                    </h2>
                    <p className="text-stone-500 mt-3 text-base max-w-xl mx-auto">
                        ROI calculator, stack rationalization, and automation risk audit — before we ever talk.
                    </p>
                </div>

                <Tabs defaultValue="savings" className="w-full">
                    <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-stone-100 p-1 rounded-lg mb-2">
                        <TabsTrigger value="savings" className="flex-1 text-xs sm:text-sm">
                            ROI Calculator
                        </TabsTrigger>
                        <TabsTrigger value="saas" className="flex-1 text-xs sm:text-sm">
                            SaaS vs. Build
                        </TabsTrigger>
                        <TabsTrigger value="audit" id="automation-auditor" className="flex-1 text-xs sm:text-sm">
                            Automation Audit
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="savings" className="mt-6">
                        <SavingsCalculator />
                    </TabsContent>

                    <TabsContent value="saas" className="mt-6">
                        <SaasVsBuild />
                    </TabsContent>

                    <TabsContent value="audit" className="mt-6">
                        <AutomationAuditor />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default ResourceHub;
