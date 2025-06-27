import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";
import ProjectModel from "@/models/ProjectModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FileModel from "@/models/FileModel";
import { hmltBoilerplateCode, scriptBoilrPlatCode, styleBoilrPlatCode } from "@/lib/sampleCode";

// CREATE project
export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        await connectDB();

        const project = await ProjectModel.create({
            name,
            userId: session.user.id
        });

        // Create default files
        await FileModel.create([
            { name: "index.html", projectId: project._id, content: htmlBoilerplateCode },
            { name: "style.css", projectId: project._id, content: styleBoilrPlatCode },
            { name: "script.js", projectId: project._id, content: scriptBoilrPlatCode },
        ]);

        return NextResponse.json(
            { message: "Project Created Successfully", data: project },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// GET all user projects
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('projectId');
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 6;
        const skip = (page - 1) * limit;

        await connectDB();

        const filterProject: any = {
            userId: session.user.id,
            ...(projectId && { _id: projectId })
        };

        const projectList = await ProjectModel.find(filterProject)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalCount = await ProjectModel.countDocuments(filterProject);
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            message: "Project list",
            data: projectList,
            totalPages,
            totalCount
        }, { status: 200 });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// UPDATE project
export async function PUT(request: NextRequest) {
    try {
        const { name, projectId } = await request.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name || !projectId) {
            return NextResponse.json({ error: "Name and Project ID are required" }, { status: 400 });
        }

        await connectDB();

        const project = await ProjectModel.findOne({ _id: projectId, userId: session.user.id });

        if (!project) {
            return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 });
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            { name },
            { new: true }
        );

        return NextResponse.json(
            { message: "Project updated successfully", data: updatedProject },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
