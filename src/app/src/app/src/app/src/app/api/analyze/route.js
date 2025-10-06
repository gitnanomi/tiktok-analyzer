import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    // 这里暂时返回模拟数据
    // 实际接入OpenAI API时会替换
    
    return NextResponse.json({
      success: true,
      message: 'Analysis complete (demo mode)',
      data: {
        videoUrl: url,
        status: 'analyzed'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    );
  }
}
