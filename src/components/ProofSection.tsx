import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsAgentDemo from "@/components/TeamsAgentDemo";
import DataTransformation from "@/components/DataTransformation";
import FieldNoteLawFirm from "@/components/FieldNoteLawFirm";
import MiniAppSandbox from "@/components/MiniAppSandbox";

const ProofSection = () => {
    return (
        <section className="py-20 bg-stone-50 border-y border-stone-200">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-10">
                    <span className="font-mono text-sm tracking-wider text-muted-foreground uppercase mb-2 block">
                        Reality Testing in Public
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900">
                        Proof of Work
                    </h2>
                    <p className="text-stone-500 mt-3 text-base max-w-xl mx-auto">
                        Live demos, data transforms, and field notes from real deployments.
                    </p>
                </div>

                <Tabs defaultValue="briefing" className="w-full">
                    <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-stone-100 p-1 rounded-lg mb-2">
                        <TabsTrigger value="briefing" className="flex-1 text-xs sm:text-sm">
                            Briefing Agent
                        </TabsTrigger>
                        <TabsTrigger value="data" className="flex-1 text-xs sm:text-sm">
                            Data Transform
                        </TabsTrigger>
                        <TabsTrigger value="lawfirm" className="flex-1 text-xs sm:text-sm">
                            Field Note: Law Firm
                        </TabsTrigger>
                        <TabsTrigger value="workflows" className="flex-1 text-xs sm:text-sm">
                            Workflow Previews
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="briefing" className="mt-6">
                        <TeamsAgentDemo />
                    </TabsContent>

                    <TabsContent value="data" className="mt-6">
                        <DataTransformation />
                    </TabsContent>

                    <TabsContent value="lawfirm" className="mt-6">
                        <FieldNoteLawFirm />
                    </TabsContent>

                    <TabsContent value="workflows" className="mt-6">
                        <MiniAppSandbox />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default ProofSection;
