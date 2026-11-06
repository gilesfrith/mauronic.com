#!/usr/bin/env bash
# Make a thumbnail (videos/<id>.jpg) from the first second of each dad joke video,
# and re-encode each video to a small, web-friendly H.264 MP4.
set -euo pipefail
cd "$(dirname "$0")/../dad-jokes/videos"
shopt -s nullglob
for v in *.mp4 *.mov; do
  id="${v%.*}"
  if [ "${v##*.}" = "mov" ] || ! ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$v" | grep -q h264; then
    ffmpeg -v error -y -i "$v" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$id.tmp.mp4"
    rm -f "$v"; mv "$id.tmp.mp4" "$id.mp4"
  fi
  ffmpeg -v error -y -ss 0.8 -i "$id.mp4" -frames:v 1 -vf "scale=540:-2" -q:v 4 "$id.jpg"
  echo "ok  $id"
done
