import {URLProps} from "@/types";
import {getUserInfo} from "@/lib/actions/user.action";
import Image from "next/image";
import {SignedIn} from "@clerk/nextjs";
import Link from "next/link";
import {auth} from "@clerk/nextjs/server";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {formatJoinDate} from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QuestionTab from "@/components/shared/QuestionTab";
import AnswersTab from "@/components/shared/AnswersTab";

const Page = async ({params, searchParams}: URLProps) => {

    const userInfo = await getUserInfo({userId: params.id});
    const {userId: clerkId} = auth()
    return (
        <>
            <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <Image src={userInfo.user?.picture} width={140} height={140} alt="author"
                           className="rounded-full"/>
                    <div className="mt-3">
                        <h2 className='h2-bold text-dark200_light900'>{userInfo.user?.name}</h2>
                        <p className="paragraph-regular text-dark200_light800">@{userInfo.user?.username}</p>
                        <div className={"mt-5 flex flex-wrap items-center justify-start gap-5"}>
                            {userInfo.user?.portfolioWebsite && (
                                <ProfileLink
                                    imgUrl="/assets/icons/link.svg"
                                    href={userInfo.user?.portfolioWebsite}
                                    title="Portfolio"/>
                            )}
                            {userInfo.user?.location && (
                                <ProfileLink
                                    imgUrl="/assets/icons/location.svg"
                                    title={userInfo.user?.location}/>
                            )}
                            <ProfileLink
                                imgUrl="/assets/icons/calendar.svg"
                                title={formatJoinDate(userInfo.user?.joinedAt.toString())}/>
                        </div>
                        {userInfo.user.bio && (
                            <p className="body-regular text-dark400_light8 mt-800">{userInfo.user?.bio}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    <SignedIn>
                        {clerkId === userInfo.user.clerkId && (
                            <Link href="/profile/edit" className="flex items-center gap-2">
                                <Button
                                    className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                                    Edit Profile
                                </Button>
                            </Link>
                        )}
                    </SignedIn>
                </div>
            </div>
            <Stats
                totalQuestions={userInfo.totalQuestions!}
                totalAnswers={userInfo.totalAnswers!}/>

            <div className="mt-10 flex w-full gap-10">
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList className="background-light800_dark400 min-h-[42px] p-1">
                        <TabsTrigger value="top-posts" className="tab">Top Posts</TabsTrigger>
                        <TabsTrigger value="answers" className="tab">Answers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts">
                        <QuestionTab
                            searchParams={searchParams}
                            userId={userInfo.user._id}
                            clerkId={userInfo.user.clerkId}/>
                    </TabsContent>
                    <TabsContent value="answers" className="">
                        <AnswersTab
                            searchParams={searchParams}
                            userId={userInfo.user._id}
                            clerkId={userInfo.user.clerkId}/>
                    </TabsContent>
                </Tabs>

            </div>
        </>
    );
};

export default Page;