import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const id = parseInt(memberId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "無効なメンバーIDです" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: {
        id: id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "メンバーが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("メンバー取得エラー:", error);
    return NextResponse.json(
      { error: "メンバーの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const id = parseInt(memberId);
    const data = await request.json();

    const member = await prisma.member.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        jobTitle: data.jobTitle,
        skills: data.skills || null,
        strengths: data.strengths || null,
        weaknesses: data.weaknesses || null,
        growthPlan: data.growthPlan || null,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("メンバー更新エラー:", error);
    return NextResponse.json(
      { error: "メンバーの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const id = parseInt(memberId);

    await prisma.member.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("メンバー削除エラー:", error);
    return NextResponse.json(
      { error: "メンバーの削除に失敗しました" },
      { status: 500 }
    );
  }
} 