import requests
import unittest
import json
from datetime import datetime

class PortfolioAPITester:
    def __init__(self, base_url="https://3067dd20-0f14-4a04-867b-67344709be32.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.supported_languages = ["en", "fr", "ar", "zh", "es"]
        self.blog_post_id = None  # Will store a blog post ID for testing

    def run_test(self, name, method, endpoint, expected_status=200, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params)
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

    def test_languages_endpoint(self):
        """Test the languages endpoint"""
        success, response = self.run_test(
            "Get Supported Languages",
            "GET",
            "languages",
            200
        )
        if success:
            data = response.json()
            # Verify all supported languages are present
            for lang in self.supported_languages:
                if lang not in data:
                    print(f"⚠️ Warning: Language '{lang}' not found in supported languages")
                    return False
            
            print(f"✅ All languages supported: {', '.join(data.keys())}")
            return True
        return False

    def test_about_endpoint_multilanguage(self):
        """Test the about endpoint with different languages"""
        all_success = True
        
        for lang in self.supported_languages:
            success, response = self.run_test(
                f"Get About Data - {lang}",
                "GET",
                "portfolio/about",
                200,
                params={"lang": lang}
            )
            
            if success:
                data = response.json()
                # Verify essential fields
                required_fields = ["name", "title", "bio", "focus_areas", "mission", "vision"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print(f"⚠️ Warning: Missing fields in about data for language '{lang}': {', '.join(missing_fields)}")
                    all_success = False
                else:
                    print(f"✅ About data for language '{lang}' contains all required fields")
            else:
                all_success = False
        
        return all_success

    def test_leadership_endpoint_multilanguage(self):
        """Test the leadership endpoint with different languages"""
        all_success = True
        
        for lang in self.supported_languages:
            success, response = self.run_test(
                f"Get Leadership Data - {lang}",
                "GET",
                "portfolio/leadership",
                200,
                params={"lang": lang}
            )
            
            if success:
                data = response.json()
                # Verify essential fields
                if "current_positions" not in data or "past_positions" not in data:
                    print(f"⚠️ Warning: Missing current_positions or past_positions in leadership data for language '{lang}'")
                    all_success = False
                    continue
                
                if not data["current_positions"] or not data["past_positions"]:
                    print(f"⚠️ Warning: Empty current_positions or past_positions in leadership data for language '{lang}'")
                    all_success = False
                    continue
                
                print(f"✅ Leadership data for language '{lang}' contains all required fields")
            else:
                all_success = False
        
        return all_success

    def test_achievements_endpoint_multilanguage(self):
        """Test the achievements endpoint with different languages"""
        all_success = True
        
        for lang in self.supported_languages:
            success, response = self.run_test(
                f"Get Achievements Data - {lang}",
                "GET",
                "portfolio/achievements",
                200,
                params={"lang": lang}
            )
            
            if success:
                data = response.json()
                # Verify essential fields
                if "fellowships" not in data or "awards" not in data:
                    print(f"⚠️ Warning: Missing fellowships or awards in achievements data for language '{lang}'")
                    all_success = False
                    continue
                
                if not data["fellowships"] or not data["awards"]:
                    print(f"⚠️ Warning: Empty fellowships or awards in achievements data for language '{lang}'")
                    all_success = False
                    continue
                
                print(f"✅ Achievements data for language '{lang}' contains all required fields")
            else:
                all_success = False
        
        return all_success

    def test_events_endpoint_multilanguage(self):
        """Test the events endpoint with different languages"""
        all_success = True
        
        for lang in self.supported_languages:
            success, response = self.run_test(
                f"Get Events Data - {lang}",
                "GET",
                "portfolio/events",
                200,
                params={"lang": lang}
            )
            
            if success:
                data = response.json()
                # Verify essential fields
                if "upcoming_events" not in data or "past_events" not in data:
                    print(f"⚠️ Warning: Missing upcoming_events or past_events in events data for language '{lang}'")
                    all_success = False
                    continue
                
                if not data["upcoming_events"] or not data["past_events"]:
                    print(f"⚠️ Warning: Empty upcoming_events or past_events in events data for language '{lang}'")
                    all_success = False
                    continue
                
                print(f"✅ Events data for language '{lang}' contains all required fields")
            else:
                all_success = False
        
        return all_success

    def test_projects_endpoint(self):
        """Test the projects endpoint"""
        success, response = self.run_test(
            "Get Projects Data",
            "GET",
            "portfolio/projects",
            200
        )
        if success:
            data = response.json()
            # Verify essential fields
            if "featured_projects" not in data:
                print("⚠️ Warning: Missing featured_projects in projects data")
                return False
            
            if not data["featured_projects"]:
                print("⚠️ Warning: Empty featured_projects in projects data")
                return False
            
            # Verify project structure
            for project in data["featured_projects"]:
                required_fields = ["title", "description", "link", "type"]
                missing_fields = [field for field in required_fields if field not in project]
                
                if missing_fields:
                    print(f"⚠️ Warning: Project missing fields: {', '.join(missing_fields)}")
                    return False
            
            print("✅ Projects data contains all required fields")
            return True
        return False

    def test_contact_endpoint(self):
        """Test the contact endpoint"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "subject": "API Test",
            "message": "This is a test message from the API test suite.",
            "message_type": "general"
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=test_data
        )
        
        if success:
            data = response.json()
            # Verify the response contains the submitted data
            for key, value in test_data.items():
                if key not in data or data[key] != value:
                    print(f"⚠️ Warning: Response data does not match submitted data for field: {key}")
                    return False
            
            print("✅ Contact form submission successful")
            return True
        return False

    def test_contact_with_different_message_types(self):
        """Test contact form with different message types"""
        message_types = ["general", "speaking", "collaboration", "media", "mentorship"]
        all_success = True
        
        for msg_type in message_types:
            test_data = {
                "name": f"Test User - {msg_type}",
                "email": f"test_{msg_type}@example.com",
                "subject": f"API Test - {msg_type}",
                "message": f"This is a test message for {msg_type} inquiry.",
                "message_type": msg_type
            }
            
            success, _ = self.run_test(
                f"Submit Contact Form - {msg_type}",
                "POST",
                "contact",
                200,
                data=test_data
            )
            
            if not success:
                all_success = False
        
        return all_success
        
    def test_blog_create_post(self):
        """Test creating a blog post"""
        test_data = {
            "title": "Test Academic Paper",
            "content": "This is a comprehensive test of an academic paper with detailed analysis and research findings. " * 20,
            "excerpt": "A brief overview of the test academic paper and its findings.",
            "tags": ["Law & Policy", "Climate Law", "Test"],
            "category": "Law & Policy",
            "paper_type": "academic",
            "academic_info": {
                "institution": "Test University",
                "field": "International Law",
                "type": "Research Paper"
            }
        }
        
        success, response = self.run_test(
            "Create Blog Post",
            "POST",
            "blog",
            201,
            data=test_data
        )
        
        if success:
            data = response.json()
            # Store the post ID for later tests
            self.blog_post_id = data.get("id")
            
            # Verify the response contains the submitted data
            for key, value in test_data.items():
                if key not in data:
                    print(f"⚠️ Warning: Response data missing field: {key}")
                    return False
                if key != "academic_info" and data[key] != value:
                    print(f"⚠️ Warning: Response data does not match submitted data for field: {key}")
                    return False
            
            # Check reading time was calculated
            if "reading_time" not in data or not isinstance(data["reading_time"], int):
                print("⚠️ Warning: Reading time not calculated correctly")
                return False
            
            print("✅ Blog post creation successful")
            return True
        return False
    
    def test_blog_get_posts(self):
        """Test getting blog posts"""
        success, response = self.run_test(
            "Get Blog Posts",
            "GET",
            "blog",
            200
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Blog posts response is not a list")
                return False
            
            if len(data) == 0:
                print("⚠️ Warning: No blog posts returned")
                return False
            
            # Check structure of first post
            post = data[0]
            required_fields = ["id", "title", "content", "excerpt", "author", "created_at", "tags", "category", "reading_time"]
            missing_fields = [field for field in required_fields if field not in post]
            
            if missing_fields:
                print(f"⚠️ Warning: Blog post missing fields: {', '.join(missing_fields)}")
                return False
            
            print(f"✅ Successfully retrieved {len(data)} blog posts")
            return True
        return False
    
    def test_blog_get_categories(self):
        """Test getting blog categories"""
        success, response = self.run_test(
            "Get Blog Categories",
            "GET",
            "blog/categories",
            200
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Blog categories response is not a list")
                return False
            
            expected_categories = ["Law & Policy", "Climate Law", "International Economics", "Youth Activism"]
            found_categories = [cat for cat in expected_categories if cat in data]
            
            print(f"✅ Found categories: {', '.join(data)}")
            return True
        return False
    
    def test_blog_get_tags(self):
        """Test getting blog tags"""
        success, response = self.run_test(
            "Get Blog Tags",
            "GET",
            "blog/tags",
            200
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Blog tags response is not a list")
                return False
            
            print(f"✅ Found tags: {', '.join(data)}")
            return True
        return False
    
    def test_blog_get_featured(self):
        """Test getting featured blog posts"""
        success, response = self.run_test(
            "Get Featured Blog Posts",
            "GET",
            "blog/featured",
            200
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Featured blog posts response is not a list")
                return False
            
            print(f"✅ Successfully retrieved {len(data)} featured blog posts")
            return True
        return False
    
    def test_blog_get_post_by_id(self):
        """Test getting a blog post by ID"""
        if not self.blog_post_id:
            print("⚠️ Warning: No blog post ID available for testing")
            return False
        
        success, response = self.run_test(
            "Get Blog Post by ID",
            "GET",
            f"blog/{self.blog_post_id}",
            200
        )
        
        if success:
            data = response.json()
            required_fields = ["id", "title", "content", "excerpt", "author", "created_at", "tags", "category", "reading_time"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"⚠️ Warning: Blog post missing fields: {', '.join(missing_fields)}")
                return False
            
            print("✅ Successfully retrieved blog post by ID")
            return True
        return False
    
    def test_blog_search(self):
        """Test blog search functionality"""
        success, response = self.run_test(
            "Search Blog Posts",
            "GET",
            "blog",
            200,
            params={"search": "test"}
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Blog search response is not a list")
                return False
            
            print(f"✅ Search returned {len(data)} results")
            return True
        return False
    
    def test_blog_filter_by_category(self):
        """Test filtering blog posts by category"""
        success, response = self.run_test(
            "Filter Blog Posts by Category",
            "GET",
            "blog",
            200,
            params={"category": "Law & Policy"}
        )
        
        if success:
            data = response.json()
            if not isinstance(data, list):
                print("⚠️ Warning: Blog category filter response is not a list")
                return False
            
            # Check that all returned posts have the correct category
            for post in data:
                if post.get("category") != "Law & Policy":
                    print(f"⚠️ Warning: Post with incorrect category returned: {post.get('category')}")
                    return False
            
            print(f"✅ Category filter returned {len(data)} results")
            return True
        return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Tests...")
        
        # Test languages endpoint
        self.test_languages_endpoint()
        
        # Test portfolio endpoints with multi-language support
        self.test_about_endpoint_multilanguage()
        self.test_leadership_endpoint_multilanguage()
        self.test_achievements_endpoint_multilanguage()
        self.test_events_endpoint_multilanguage()
        self.test_projects_endpoint()
        
        # Test contact endpoints
        self.test_contact_endpoint()
        self.test_contact_with_different_message_types()
        
        # Test blog endpoints
        self.test_blog_create_post()
        self.test_blog_get_posts()
        self.test_blog_get_categories()
        self.test_blog_get_tags()
        self.test_blog_get_featured()
        self.test_blog_get_post_by_id()
        self.test_blog_search()
        self.test_blog_filter_by_category()
        
        # Print summary
        print("\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed / self.tests_run) * 100:.2f}%")
        
        return self.test_results

if __name__ == "__main__":
    tester = PortfolioAPITester()
    results = tester.run_all_tests()
    
    # Save results to file
    with open("api_test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nTest results saved to api_test_results.json")