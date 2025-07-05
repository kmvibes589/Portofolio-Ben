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

    def test_about_endpoint(self):
        """Test the about endpoint"""
        success, response = self.run_test(
            "Get About Data",
            "GET",
            "portfolio/about",
            200
        )
        if success:
            data = response.json()
            # Verify essential fields
            required_fields = ["name", "title", "bio", "focus_areas", "mission", "vision"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"⚠️ Warning: Missing fields in about data: {', '.join(missing_fields)}")
                return False
            
            print("✅ About data contains all required fields")
            return True
        return False

    def test_leadership_endpoint(self):
        """Test the leadership endpoint"""
        success, response = self.run_test(
            "Get Leadership Data",
            "GET",
            "portfolio/leadership",
            200
        )
        if success:
            data = response.json()
            # Verify essential fields
            if "current_positions" not in data or "past_positions" not in data:
                print("⚠️ Warning: Missing current_positions or past_positions in leadership data")
                return False
            
            if not data["current_positions"] or not data["past_positions"]:
                print("⚠️ Warning: Empty current_positions or past_positions in leadership data")
                return False
            
            print("✅ Leadership data contains all required fields")
            return True
        return False

    def test_achievements_endpoint(self):
        """Test the achievements endpoint"""
        success, response = self.run_test(
            "Get Achievements Data",
            "GET",
            "portfolio/achievements",
            200
        )
        if success:
            data = response.json()
            # Verify essential fields
            if "fellowships" not in data or "awards" not in data:
                print("⚠️ Warning: Missing fellowships or awards in achievements data")
                return False
            
            if not data["fellowships"] or not data["awards"]:
                print("⚠️ Warning: Empty fellowships or awards in achievements data")
                return False
            
            print("✅ Achievements data contains all required fields")
            return True
        return False

    def test_events_endpoint(self):
        """Test the events endpoint"""
        success, response = self.run_test(
            "Get Events Data",
            "GET",
            "portfolio/events",
            200
        )
        if success:
            data = response.json()
            # Verify essential fields
            if "upcoming_events" not in data or "past_events" not in data:
                print("⚠️ Warning: Missing upcoming_events or past_events in events data")
                return False
            
            if not data["upcoming_events"] or not data["past_events"]:
                print("⚠️ Warning: Empty upcoming_events or past_events in events data")
                return False
            
            print("✅ Events data contains all required fields")
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

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Tests...")
        
        # Test portfolio endpoints
        self.test_about_endpoint()
        self.test_leadership_endpoint()
        self.test_achievements_endpoint()
        self.test_events_endpoint()
        
        # Test contact endpoints
        self.test_contact_endpoint()
        self.test_contact_with_different_message_types()
        
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