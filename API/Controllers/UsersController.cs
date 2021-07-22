using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
   // [controller] below: actual route would be api/users
   public class UsersController : BaseApiController
   {
   	private readonly DataContext _context;
      public UsersController(DataContext context)
      {
      	_context = context;
      }

		[HttpGet]
		[AllowAnonymous]
		public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
		{
			return await _context.Users.ToListAsync();
		}



		// /api/users/3
		[Authorize]
		[HttpGet("{id}")]
		public async Task<ActionResult<AppUser>> GetUser(int id)
		{
			return await _context.Users.FindAsync(id);
		}
   }
}