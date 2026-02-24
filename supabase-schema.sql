-- StoryDeck AI Database Schema

-- 1. Users Table (Public profile linked to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT,
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'business')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    business_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Deck Outlines Table
CREATE TABLE IF NOT EXISTS deck_outlines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    structured_json JSONB NOT NULL DEFAULT '{}',
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id) -- Ensure one outline per project
);

-- 3. Slides Table
CREATE TABLE IF NOT EXISTS slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    slide_type TEXT NOT NULL,
    slide_order INTEGER NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{}',
    template TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Brand Kits Table
CREATE TABLE IF NOT EXISTS brand_kits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    primary_color TEXT DEFAULT '#4F46E5', -- Default indigo
    secondary_color TEXT DEFAULT '#0F172A', -- Default slate
    font_family TEXT DEFAULT 'Inter',
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id) -- Ensure one brand kit per user
);

-- Row Level Security (RLS) Configuration

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;

-- Policies for 'users'
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for 'projects'
CREATE POLICY "Users can create their own projects" 
ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE USING (auth.uid() = user_id);

-- Policies for 'deck_outlines' (via project access)
CREATE POLICY "Users can manage outlines for their projects" 
ON deck_outlines FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = deck_outlines.project_id 
        AND projects.user_id = auth.uid()
    )
);

-- Policies for 'slides' (via project access)
CREATE POLICY "Users can manage slides for their projects" 
ON slides FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = slides.project_id 
        AND projects.user_id = auth.uid()
    )
);

-- Policies for 'brand_kits'
CREATE POLICY "Users can manage their own brand kits" 
ON brand_kits FOR ALL USING (auth.uid() = user_id);
