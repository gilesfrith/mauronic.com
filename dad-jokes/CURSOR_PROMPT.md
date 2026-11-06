# Generate the dad joke videos (Cursor Agent)

Open the `mauronic.com` folder in Cursor, start an Agent chat, and paste everything
below the line.

---

Generate the 20 dad joke videos for this site using your `generate_video` tool.

The jokes are in `dad-jokes/jokes.json`. Work through them **in order, one at a time**:

1. Skip any joke whose file `dad-jokes/videos/<id>.mp4` already exists.
2. Call `generate_video` with:
   - `prompt`: the style line below, a blank line, then the joke's `prompt` field
   - `duration_seconds`: 5
   - `aspect_ratio`: "9:16"
   - `file_path`: `dad-jokes/videos/<id>.mp4`
3. If the tool saves somewhere else or as another format, move or convert it
   to `dad-jokes/videos/<id>.mp4` (H.264 MP4) with ffmpeg.
4. If a generation fails, retry it once, then move on and note it.

Style line (prepend to every prompt):

> Photorealistic, cinematic short video, warm natural light, shallow depth of field,
> like a nature documentary with a comedic twist. Vertical 9:16, 5 seconds. The
> character speaks the line clearly with natural lip and mouth movement and matching
> ambient sound. No on-screen text, captions, subtitles or logos.

When all 20 are done, run `tools/posters.sh` to make the thumbnail images, then
list which videos succeeded and which failed. Do not edit `jokes.json` or any HTML.
