import requests
import unittest
import json
import os
from datetime import datetime
import mimetypes
import tempfile

class PortfolioAPITester:
    def __init__(self, base_url="https://c39d1efd-d471-42fc-bb51-7fd2fb2260e2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.supported_languages = ["en", "fr", "ar", "zh", "es"]
        self.blog_post_id = None  # Will store a blog post ID for testing
        self.admin_token = None   # Will store admin JWT token
        self.uploaded_media_id = None  # Will store an uploaded media ID for testing

    def run_test(self, name, method, endpoint, expected_status=200, data=None, params=None, headers=None, files=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        if not headers:
            headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                if files:
                    # For multipart/form-data requests (file uploads)
                    response = requests.post(url, data=data, files=files, headers=headers, params=params)
                else:
                    response = requests.post(url, json=data, headers=headers, params=params)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, params=params)
            else:
                raise ValueError(f"Unsupported method: {method}")

            success = response.status_code == expected_status
            
            result = {
                "name": name,
                "url": url,
                "method": method,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "success": success
            }
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.text:
                    try:
                        result["response"] = response.json()
                    except:
                        result["response"] = response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                result["error"] = response.text

            self.test_results.append(result)
            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "url": url,
                "method": method,
                "success": False,
                "error": str(e)
            })
            return False, None

    # Admin Authentication Tests
    def test_admin_login_success(self):
        """Test admin login with correct credentials"""
        login_data = {
            "username": "benjamin_admin",
            "password": "KyamonekaBenjamin2025!"
        }
        
        success, response = self.run_test(
            "Admin Login - Success",
            "POST",
            "admin/login",
            200,
            data=login_data
        )
        
        if success:
            data = response.json()
            # Verify token structure
            if "access_token" not in data or "token_type" not in data or "expires_in" not in data:
                print("⚠️ Warning: Login response missing token fields")
                return False
            
            # Store token for subsequent tests
            self.admin_token = data["access_token"]
            print(f"✅ Admin login successful, token received")
            return True
        return False
    
    def test_admin_login_failure(self):
        """Test admin login with incorrect credentials"""
        login_data = {
            "username": "benjamin_admin",
            "password": "wrong_password"
        }
        
        success, response = self.run_test(
            "Admin Login - Failure",
            "POST",
            "admin/login",
            401,  # Expecting unauthorized
            data=login_data
        )
        
        return success
    
    def test_admin_verify_token(self):
        """Test admin token verification"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Admin Token Verification",
            "GET",
            "admin/verify",
            200,
            headers=headers
        )
        
        if success:
            data = response.json()
            if "message" not in data or "username" not in data:
                print("⚠️ Warning: Verify response missing expected fields")
                return False
            
            if data["username"] != "benjamin_admin":
                print(f"⚠️ Warning: Unexpected username in verify response: {data['username']}")
                return False
            
            print("✅ Admin token verification successful")
            return True
        return False
    
    def test_admin_verify_invalid_token(self):
        """Test admin token verification with invalid token"""
        headers = {
            'Authorization': 'Bearer invalid_token'
        }
        
        success, response = self.run_test(
            "Admin Token Verification - Invalid Token",
            "GET",
            "admin/verify",
            401,  # Expecting unauthorized
            headers=headers
        )
        
        return success
    
    # Media Upload API Tests
    def test_media_upload_image(self):
        """Test uploading an image file"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        # Create a temporary image file
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            temp_file.write(b"Test image content")
            temp_file_path = temp_file.name
        
        try:
            headers = {
                'Authorization': f'Bearer {self.admin_token}'
            }
            
            files = {
                'file': ('test_image.jpg', open(temp_file_path, 'rb'), 'image/jpeg')
            }
            
            data = {
                'category': 'profile',
                'description': 'Test profile image upload'
            }
            
            success, response = self.run_test(
                "Media Upload - Image",
                "POST",
                "admin/media/upload",
                200,
                data=data,
                headers=headers,
                files=files
            )
            
            if success:
                data = response.json()
                # Store media ID for later tests
                self.uploaded_media_id = data.get("id")
                
                # Verify response structure
                required_fields = ["id", "filename", "file_path", "file_type", "category"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"⚠️ Warning: Media upload response missing fields: {', '.join(missing_fields)}")
                    return False
                
                if data["file_type"] != "image":
                    print(f"⚠️ Warning: Uploaded file has incorrect type: {data['file_type']}")
                    return False
                
                if data["category"] != "profile":
                    print(f"⚠️ Warning: Uploaded file has incorrect category: {data['category']}")
                    return False
                
                print("✅ Image upload successful")
                return True
            return False
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
    
    def test_media_upload_video(self):
        """Test uploading a video file"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        # Create a temporary video file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            temp_file.write(b"Test video content")
            temp_file_path = temp_file.name
        
        try:
            headers = {
                'Authorization': f'Bearer {self.admin_token}'
            }
            
            files = {
                'file': ('test_video.mp4', open(temp_file_path, 'rb'), 'video/mp4')
            }
            
            data = {
                'category': 'video',
                'description': 'Test video upload'
            }
            
            success, response = self.run_test(
                "Media Upload - Video",
                "POST",
                "admin/media/upload",
                200,
                data=data,
                headers=headers,
                files=files
            )
            
            if success:
                data = response.json()
                # Store media ID if we don't have one yet
                if not self.uploaded_media_id:
                    self.uploaded_media_id = data.get("id")
                
                # Verify response structure
                required_fields = ["id", "filename", "file_path", "file_type", "category"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"⚠️ Warning: Media upload response missing fields: {', '.join(missing_fields)}")
                    return False
                
                if data["file_type"] != "video":
                    print(f"⚠️ Warning: Uploaded file has incorrect type: {data['file_type']}")
                    return False
                
                if data["category"] != "video":
                    print(f"⚠️ Warning: Uploaded file has incorrect category: {data['category']}")
                    return False
                
                print("✅ Video upload successful")
                return True
            return False
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
    
    def test_media_upload_invalid_file(self):
        """Test uploading an invalid file type"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        # Create a temporary text file
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as temp_file:
            temp_file.write(b"Test text content")
            temp_file_path = temp_file.name
        
        try:
            headers = {
                'Authorization': f'Bearer {self.admin_token}'
            }
            
            files = {
                'file': ('test.txt', open(temp_file_path, 'rb'), 'text/plain')
            }
            
            data = {
                'category': 'general',
                'description': 'Test invalid file upload'
            }
            
            success, response = self.run_test(
                "Media Upload - Invalid File Type",
                "POST",
                "admin/media/upload",
                400,  # Expecting bad request
                data=data,
                headers=headers,
                files=files
            )
            
            return success
        finally:
            # Clean up the temporary file
            os.unlink(temp_file_path)
    
    # Media Management API Tests
    def test_get_media_files(self):
        """Test getting all media files"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Get All Media Files",
            "GET",
            "admin/media",
            200,
            headers=headers
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Media files response is not a list")
                return False
            
            print(f"✅ Successfully retrieved {len(data)} media files")
            return True
        return False
    
    def test_get_media_files_by_type(self):
        """Test getting media files filtered by type"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        # Test image filter
        success_image, response_image = self.run_test(
            "Get Media Files - Image Filter",
            "GET",
            "admin/media",
            200,
            params={"file_type": "image"},
            headers=headers
        )
        
        if success_image:
            data = response_image.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Media files response is not a list")
                return False
            
            # Verify all items are images
            for item in data:
                if item.get("file_type") != "image":
                    print(f"⚠️ Warning: Non-image file in image filter results: {item.get('file_type')}")
                    return False
            
            print(f"✅ Successfully retrieved {len(data)} image files")
        else:
            return False
        
        # Test video filter
        success_video, response_video = self.run_test(
            "Get Media Files - Video Filter",
            "GET",
            "admin/media",
            200,
            params={"file_type": "video"},
            headers=headers
        )
        
        if success_video:
            data = response_video.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Media files response is not a list")
                return False
            
            # Verify all items are videos
            for item in data:
                if item.get("file_type") != "video":
                    print(f"⚠️ Warning: Non-video file in video filter results: {item.get('file_type')}")
                    return False
            
            print(f"✅ Successfully retrieved {len(data)} video files")
            return True
        return False
    
    def test_get_media_files_by_category(self):
        """Test getting media files filtered by category"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        # Test profile category filter
        success, response = self.run_test(
            "Get Media Files - Category Filter",
            "GET",
            "admin/media",
            200,
            params={"category": "profile"},
            headers=headers
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Media files response is not a list")
                return False
            
            # Verify all items have the correct category
            for item in data:
                if item.get("category") != "profile":
                    print(f"⚠️ Warning: File with incorrect category in results: {item.get('category')}")
                    return False
            
            print(f"✅ Successfully retrieved {len(data)} files with category 'profile'")
            return True
        return False
    
    def test_update_media_file(self):
        """Test updating media file metadata"""
        if not self.admin_token or not self.uploaded_media_id:
            print("⚠️ Warning: No admin token or media ID available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}',
            'Content-Type': 'application/json'
        }
        
        update_data = {
            "category": "hero",
            "description": "Updated test description"
        }
        
        success, response = self.run_test(
            "Update Media File",
            "PUT",
            f"admin/media/{self.uploaded_media_id}",
            200,
            data=update_data,
            headers=headers
        )
        
        if success:
            data = response.json()
            # Verify the update was applied
            if data.get("category") != "hero":
                print(f"⚠️ Warning: Category not updated, got: {data.get('category')}")
                return False
            
            if data.get("description") != "Updated test description":
                print(f"⚠️ Warning: Description not updated, got: {data.get('description')}")
                return False
            
            print("✅ Media file update successful")
            return True
        return False
    
    def test_delete_media_file(self):
        """Test deleting a media file"""
        if not self.admin_token or not self.uploaded_media_id:
            print("⚠️ Warning: No admin token or media ID available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Delete Media File",
            "DELETE",
            f"admin/media/{self.uploaded_media_id}",
            200,
            headers=headers
        )
        
        if success:
            data = response.json()
            if "message" not in data:
                print("⚠️ Warning: Delete response missing message field")
                return False
            
            print("✅ Media file deletion successful")
            return True
        return False
    
    # Static File Serving Test
    def test_static_file_serving(self):
        """Test that uploaded files are accessible via static file serving"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        # First, get a list of media files
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Get Media Files for Static Serving Test",
            "GET",
            "admin/media",
            200,
            headers=headers
        )
        
        if not success or not response.json():
            print("⚠️ Warning: No media files available for testing static serving")
            return False
        
        # Try to access the first file
        media_file = response.json()[0]
        file_path = media_file.get("file_path")
        
        if not file_path:
            print("⚠️ Warning: Media file missing file_path")
            return False
        
        # Remove leading slash if present
        if file_path.startswith("/"):
            file_path = file_path[1:]
        
        # Test accessing the file
        try:
            file_url = f"{self.base_url}/{file_path}"
            file_response = requests.get(file_url)
            
            if file_response.status_code == 200:
                print(f"✅ Successfully accessed static file: {file_url}")
                return True
            else:
                print(f"❌ Failed to access static file: {file_url}, status: {file_response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error accessing static file: {str(e)}")
            return False
    
    # Admin Blog Management Tests
    def test_admin_blog_create(self):
        """Test creating a blog post as admin"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}',
            'Content-Type': 'application/json'
        }
        
        blog_data = {
            "title": "Admin Test Blog Post",
            "content": "This is a test blog post created through the admin API. " * 10,
            "excerpt": "A brief overview of the admin test blog post.",
            "tags": ["Admin", "Test", "API"],
            "category": "Law & Policy"
        }
        
        success, response = self.run_test(
            "Admin Create Blog Post",
            "POST",
            "admin/blog",
            200,
            data=blog_data,
            headers=headers
        )
        
        if success:
            data = response.json()
            # Store the post ID for later tests
            self.blog_post_id = data.get("id")
            
            # Verify the response contains the submitted data
            for key, value in blog_data.items():
                if key not in data:
                    print(f"⚠️ Warning: Response data missing field: {key}")
                    return False
                if data[key] != value:
                    print(f"⚠️ Warning: Response data does not match submitted data for field: {key}")
                    return False
            
            print("✅ Admin blog post creation successful")
            return True
        return False
    
    def test_admin_get_blog_posts(self):
        """Test getting all blog posts as admin"""
        if not self.admin_token:
            print("⚠️ Warning: No admin token available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Admin Get All Blog Posts",
            "GET",
            "admin/blog",
            200,
            headers=headers
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Admin blog posts response is not a list")
                return False
            
            print(f"✅ Successfully retrieved {len(data)} blog posts as admin")
            return True
        return False
    
    def test_admin_update_blog_post(self):
        """Test updating a blog post as admin"""
        if not self.admin_token or not self.blog_post_id:
            print("⚠️ Warning: No admin token or blog post ID available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}',
            'Content-Type': 'application/json'
        }
        
        update_data = {
            "title": "Updated Admin Test Blog Post",
            "excerpt": "Updated excerpt for the admin test blog post.",
            "tags": ["Admin", "Test", "Updated"],
            "published": True
        }
        
        success, response = self.run_test(
            "Admin Update Blog Post",
            "PUT",
            f"admin/blog/{self.blog_post_id}",
            200,
            data=update_data,
            headers=headers
        )
        
        if success:
            data = response.json()
            # Verify the update was applied
            for key, value in update_data.items():
                if data.get(key) != value:
                    print(f"⚠️ Warning: {key} not updated, got: {data.get(key)}")
                    return False
            
            print("✅ Admin blog post update successful")
            return True
        return False
    
    def test_admin_delete_blog_post(self):
        """Test deleting a blog post as admin"""
        if not self.admin_token or not self.blog_post_id:
            print("⚠️ Warning: No admin token or blog post ID available for testing")
            return False
        
        headers = {
            'Authorization': f'Bearer {self.admin_token}'
        }
        
        success, response = self.run_test(
            "Admin Delete Blog Post",
            "DELETE",
            f"admin/blog/{self.blog_post_id}",
            200,
            headers=headers
        )
        
        if success:
            data = response.json()
            if "message" not in data:
                print("⚠️ Warning: Delete response missing message field")
                return False
            
            print("✅ Admin blog post deletion successful")
            return True
        return False
    
    # Portfolio Data Endpoints Tests
    def test_portfolio_about(self):
        """Test the portfolio about endpoint"""
        success, response = self.run_test(
            "Get Portfolio About Data",
            "GET",
            "portfolio/about",
            200
        )
        
        if success:
            data = response.json()
            required_fields = ["name", "title", "bio", "focus_areas", "mission", "vision"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"⚠️ Warning: Missing fields in about data: {', '.join(missing_fields)}")
                return False
            
            print("✅ Portfolio about data contains all required fields")
            return True
        return False
    
    def test_portfolio_leadership(self):
        """Test the portfolio leadership endpoint"""
        success, response = self.run_test(
            "Get Portfolio Leadership Data",
            "GET",
            "portfolio/leadership",
            200
        )
        
        if success:
            data = response.json()
            if "current_positions" not in data or "past_positions" not in data:
                print("⚠️ Warning: Missing current_positions or past_positions in leadership data")
                return False
            
            print("✅ Portfolio leadership data contains all required fields")
            return True
        return False
    
    def test_portfolio_achievements(self):
        """Test the portfolio achievements endpoint"""
        success, response = self.run_test(
            "Get Portfolio Achievements Data",
            "GET",
            "portfolio/achievements",
            200
        )
        
        if success:
            data = response.json()
            if "fellowships" not in data or "awards" not in data:
                print("⚠️ Warning: Missing fellowships or awards in achievements data")
                return False
            
            print("✅ Portfolio achievements data contains all required fields")
            return True
        return False
    
    def test_portfolio_events(self):
        """Test the portfolio events endpoint"""
        success, response = self.run_test(
            "Get Portfolio Events Data",
            "GET",
            "portfolio/events",
            200
        )
        
        if success:
            data = response.json()
            if "upcoming_events" not in data or "past_events" not in data:
                print("⚠️ Warning: Missing upcoming_events or past_events in events data")
                return False
            
            print("✅ Portfolio events data contains all required fields")
            return True
        return False
    
    def test_portfolio_projects(self):
        """Test the portfolio projects endpoint"""
        success, response = self.run_test(
            "Get Portfolio Projects Data",
            "GET",
            "portfolio/projects",
            200
        )
        
        if success:
            data = response.json()
            if "featured_projects" not in data:
                print("⚠️ Warning: Missing featured_projects in projects data")
                return False
            
            print("✅ Portfolio projects data contains all required fields")
            return True
        return False
    
    def run_admin_tests(self):
        """Run all admin panel tests"""
        print("🚀 Starting Admin Panel API Tests...")
        
        # Admin Authentication Tests
        print("\n🔒 Testing Admin Authentication...")
        self.test_admin_login_success()
        self.test_admin_login_failure()
        self.test_admin_verify_token()
        self.test_admin_verify_invalid_token()
        
        # Media Upload and Management Tests
        print("\n📁 Testing Media Upload and Management...")
        self.test_media_upload_image()
        self.test_media_upload_video()
        self.test_media_upload_invalid_file()
        self.test_get_media_files()
        self.test_get_media_files_by_type()
        self.test_get_media_files_by_category()
        self.test_update_media_file()
        self.test_static_file_serving()
        self.test_delete_media_file()
        
        # Blog Management Tests
        print("\n📝 Testing Blog Management...")
        self.test_admin_blog_create()
        self.test_admin_get_blog_posts()
        self.test_admin_update_blog_post()
        self.test_admin_delete_blog_post()
        
        # Portfolio Data Endpoints
        print("\n📊 Testing Portfolio Data Endpoints...")
        self.test_portfolio_about()
        self.test_portfolio_leadership()
        self.test_portfolio_achievements()
        self.test_portfolio_events()
        self.test_portfolio_projects()
        
        # Print summary
        print("\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed / self.tests_run) * 100:.2f}%")
        
        return self.test_results

if __name__ == "__main__":
    tester = PortfolioAPITester()
    results = tester.run_admin_tests()
    
    # Save results to file
    with open("admin_api_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nTest results saved to admin_api_test_results.json")